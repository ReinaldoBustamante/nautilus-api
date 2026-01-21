import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dtos/createUserDto';
import { UpdateUserDto } from './dtos/updateUserDto';
import { BcryptAdapter } from 'src/auth/adapters/bcrypt.adapter';


const USER_SELECT_FIELDS = {
    id: true,
    email: true,
    user_role: true,
    user_status: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
};

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService, private bcryptAdapter: BcryptAdapter) { }

    async findAll() {
        return await this.prisma.user.findMany({
            where: { deleted_at: null },
            select: USER_SELECT_FIELDS
        });
    }

    async create(payload: CreateUserDto) {
        try {
            return await this.prisma.user.create({
                data: { ...payload, password: await this.bcryptAdapter.encryptPassword(payload.password) },
                select: USER_SELECT_FIELDS
            })
        } catch (err) {
            if (err.code === 'P2002') throw new ConflictException('User already exist')
            throw err
        }
    }

    async update(payload: UpdateUserDto, id: string) {
        try {
            return await this.prisma.user.update({
                data: {
                    ...payload,
                    updated_at: new Date()
                },
                where: { id, deleted_at: null },
                select: USER_SELECT_FIELDS
            })
        } catch (err) {
            if (err.code === 'P2025') throw new NotFoundException('Resource not found')
            if (err.code === 'P2002') throw new ConflictException('Email already in use');
            throw err
        }
    }

    async delete(id: string) {
        try {
            return await this.prisma.user.update({
                data: { deleted_at: new Date(), user_status: 'deleted' },
                select: USER_SELECT_FIELDS,
                where: { id, deleted_at: null }
            })
        } catch (err) {
            if (err.code === 'P2025') throw new NotFoundException('Resource not found')
            throw err
        }
    }
}
