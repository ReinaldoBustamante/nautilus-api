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
        const start = performance.now();
        const user = await this.prisma.user.findFirst({
            where: {
                email: payload.email,
                deleted_at: null
            },
        })
        console.log(`Consulta DB: ${performance.now() - start}ms`);
        if (!user?.email) throw new UnauthorizedException('Invalid credentials');
        if (user?.user_status !== user_status_type.active) throw new UnauthorizedException('Invalid credentials');
        if (!user.password) throw new UnauthorizedException('Invalid credentials')
        const isValidPassword = await this.bcryptAdapter.comparePassword(payload.password, user.password)
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
            return { message: 'User logout success' };
        } catch (error) {
            console.error('Redis logout error:', error);
            throw error
        }

    }

    async refresh(req: Request, res: Response) {
        const oldRefreshToken = req.cookies['refresh_token'];
        if (!oldRefreshToken) throw new UnauthorizedException('No refresh token provided');

        const payload = await JWTAdapter.verifyToken(oldRefreshToken, true) as JwtPayload;
        if (!payload?.sub) throw new UnauthorizedException('Invalid or expired refresh token');

        const redisKey = `refresh_token:${payload.sub}`;

        try {
            const storedToken = await this.redis.get(redisKey);

            if (oldRefreshToken !== storedToken) {
                // Si hay un mismatch, borramos por seguridad (si Redis está vivo)
                await this.redis.del(redisKey).catch(() => { });
                throw new ForbiddenException('Token mismatch - possible reuse detected');
            }

            const userData = { sub: payload.sub, role: payload.role };
            const accessToken = JWTAdapter.generateToken(userData, '10m');
            const newRefreshToken = JWTAdapter.generateToken(userData, '7d');

            // Actualizamos Redis y la Cookie
            await this.redis.set(redisKey, newRefreshToken, 'EX', 7 * 24 * 60 * 60);

            res.cookie('refresh_token', newRefreshToken, {
                httpOnly: true,
                secure: true, // Asegúrate de que tu front use HTTPS o esto fallará en prod
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return { token: accessToken };

        } catch (error) {
            if (error instanceof ForbiddenException) throw error;

            // Si Redis falla (ECONNRESET), decidimos si dejar pasar o bloquear.
            // Lo más seguro es loguear y lanzar error de servicio no disponible.
            console.error('Error de sesión (Redis):', error.message);
            throw new UnauthorizedException('Session could not be verified');
        }
    }
    async profile(userId: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: {
                    doctor: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            })
            if (!user) {
                throw new Error("Usuario no encontrado");
            }
            const { password, ...rest } = user
            return rest
        } catch (error) {
            console.error("JWT Verification Error:", error.message);
            throw new Error('Unauthorized');
        }
    }
}
