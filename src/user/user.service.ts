import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dtos/CreateUserDto';
import { UpdateUserDto } from './dtos/UpdateUserDto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        const user = await this.prisma.user.findMany({
            where: { deleted_at: null },
            select: { id: true, email: true, role: true, is_active: true, created_at: true }
        })
        return user
    }

    async create(payload: CreateUserDto) {
        return this.prisma.user.create({
            data: payload
        })
    }

    async update(payload: UpdateUserDto, id: string) {
        return this.prisma.user.update({
            where: { id },
            data: payload
        })
    }

    async toggleStatus(id: string) {
        const user = await this.prisma.user.findFirst({
            where: { id, deleted_at: null },
        })

        if (!user) {
            throw new NotFoundException('Usuario no encontrado')
        }

        return this.prisma.user.update({
            where: { id },
            data: { is_active: !user.is_active },
            select: {
                id: true,
                email: true,
                role: true,
                is_active: true,
                created_at: true,
            },
        })
    }


    async delete(id: string) {
        const user = await this.prisma.user.update({
            where: {
                id: id
            },
            data: {
                deleted_at: new Date()
            },
            select: {
                id: true,
                email: true,
                role: true,
                is_active: true,
                created_at: true,
                deleted_at: true
            }
        })

        return user
    }
}
