import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { BcryptAdapter } from './adapters/bcrypt.adapter';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { PrismaService } from 'src/prisma.service';
import { LoginUserDto } from './dtos/LoginUser.dto';

import { user_status_type } from 'generated/prisma/enums';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { JWTAdapter } from 'src/common/adapters/jwt.adapter';


@Injectable()
export class AuthService {
    constructor(
        private bcryptAdapter: BcryptAdapter,
        private prisma: PrismaService,
    ) { }

    async create(payload: CreateUserDto) {
        const user = {
            ...payload,
            password: await this.bcryptAdapter.encryptPassword(payload.password)
        }
        try {
            const { password, ...newUser } = await this.prisma.user.create({
                data: user
            })
            return newUser
        } catch (err) {
            if (err.code === 'P2002') {
                throw new ConflictException('Email already exists');
            }
            throw err;
        }
    }

    async login(payload: LoginUserDto) {
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
        return {
            sub: user.id,
            role: user.user_role,
            token: JWTAdapter.generateToken({
                sub: user.id,
                role: user.user_role
            })
        }
    }

    async me(req: Request) {
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
                    user = await this.prisma.user.findUnique({ where: { id }, select: {email: true, user_role: true, user_status: true} });
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
