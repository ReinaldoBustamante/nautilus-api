import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { BcryptAdapter } from './adapters/bcrypt.adapter';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { PrismaService } from 'src/prisma.service';
import { LoginUserDto } from './dtos/LoginUser.dto';
import { JWTAdapter } from './adapters/jwt.adapter';

@Injectable()
export class AuthService {
    constructor(
        private bcryptAdapter: BcryptAdapter,
        private jwtAdapter: JWTAdapter,
        private prisma: PrismaService
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
        const user = await this.prisma.user.findUnique({ 
            where: {
                email: payload.email
            },
        })
        if(!user?.email) throw new UnauthorizedException('Invalid credentials');
        const isValidPassword = await this.bcryptAdapter.comparePassword(user.password, payload.password)
        if(!isValidPassword) throw new UnauthorizedException('Invalid credentials');
        return {
            email: user.email,
            token: this.jwtAdapter.generateToken({
                sub: user.id,
                role_id: user.role_id
            })
        } 
    }

}
