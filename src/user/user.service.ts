import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dtos/CreateUserDto';
import { UpdateUserDto } from './dtos/UpdateUserDto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        const user = await this.prisma.user.findMany({
            select: { id: true, email: true, role: true, status:true, created_at: true, deleted_at: true }
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
                created_at: true,
                deleted_at: true
            }
        })

        return user
    }
}
