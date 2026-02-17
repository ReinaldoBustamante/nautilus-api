import { ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { BcryptAdapter } from './adapters/bcrypt.adapter';
import { PrismaService } from 'src/prisma.service';
import { LoginUserDto } from './dtos/LoginUser.dto';
import { user_status_type } from 'generated/prisma/enums';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { JWTAdapter } from 'src/common/adapters/jwt.adapter';
import type { Response, Request } from 'express';
import Redis from 'ioredis';


@Injectable()
export class AuthService {
    constructor(
        private bcryptAdapter: BcryptAdapter,
        private prisma: PrismaService,
        @Inject('REDIS_CLIENT') private readonly redis: Redis
    ) { }

    async login(payload: LoginUserDto, res: Response) {
        const user = await this.prisma.user.findFirst({
            where: {
                email: payload.email,
                deleted_at: null
            },
        })
        if (!user?.email) throw new UnauthorizedException('Invalid credentials');
        if (user?.user_status !== user_status_type.active) throw new UnauthorizedException('Invalid credentials');
        if (!user.password) throw new UnauthorizedException('Invalid credentials')
        const isValidPassword = await this.bcryptAdapter.comparePassword(user.password, payload.password)
        if (!isValidPassword) throw new UnauthorizedException('Invalid credentials');

        const accessToken = JWTAdapter.generateToken({ sub: user.id, role: user.user_role }, '10m');
        const refreshToken = JWTAdapter.generateToken({ sub: user.id, role: user.user_role }, '7d');
        await this.redis.set(`refresh_token:${user.id}`, refreshToken, 'EX', 7 * 24 * 60 * 60);
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return {
            sub: user.id,
            role: user.user_role,
            token: accessToken
        }
    }

    async logout(userId: string) {
        try {
            await this.redis.del(`refresh_token:${userId}`);
        } catch (error) {
            console.error('Redis logout error:', error);
            throw error
        }
        return { message: 'User logout success' };
    }

    async refresh(req: Request, res: Response) {
        const oldRefreshToken = req.cookies['refresh_token'];
        if (!oldRefreshToken) {
            throw new UnauthorizedException('No refresh token provided');
        }
        const payload = await JWTAdapter.verifyToken(oldRefreshToken) as JwtPayload;
        if (!payload || !payload.sub) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        const redisKey = `refresh_token:${payload.sub}`;
        const storedToken = await this.redis.get(redisKey);
        if (oldRefreshToken !== storedToken) {
            await this.redis.del(redisKey);
            throw new ForbiddenException('Token mismatch - possible reuse detected');
        }

        const userData = { sub: payload.sub, role: payload.role };
        const accessToken = JWTAdapter.generateToken(userData, '10m');
        const newRefreshToken = JWTAdapter.generateToken(userData, '7d');

        await this.redis.set(redisKey, newRefreshToken, 'EX', 7 * 24 * 60 * 60);
        res.cookie('refresh_token', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return {
            token: accessToken
        };
    }

    async profile(req: Request) {
        try {
            const authHeader = req.headers['authorization'];
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new Error('No token provided or invalid format');
            }

            const token = authHeader.split(" ")[1];
            const decodedToken = await JWTAdapter.verifyToken(token) as JwtPayload;

            if (!decodedToken) {
                throw new Error('Invalid token payload');
            }
            const { sub: id, role } = decodedToken
            let user: any = null;

            switch (role) {
                case 'admin':
                    user = await this.prisma.user.findUnique({ where: { id }, select: { email: true, user_role: true, user_status: true } });
                    break;
                case 'patient':
                    user = await this.prisma.patient.findFirst({
                        where: { user_id: id, deleted_at: null },
                        include: { user: { select: { email: true } } }
                    });
                    break;
                case 'doctor':
                    user = await this.prisma.doctor.findFirst({
                        where: { user_id: id, deleted_at: null },
                        include: { user: { select: { email: true } } }
                    });
                    break;
                default:
                    throw new Error('Invalid role');
            }


            if (!user) throw new Error('user not found');

            return {
                user
            };
        } catch (error) {
            console.error("JWT Verification Error:", error.message);
            throw new Error('Unauthorized');
        }
    }
}
