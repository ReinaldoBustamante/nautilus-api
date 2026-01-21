import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateServiceDto } from './dtos/CreateServiceDto';
import { UpdateServiceDto } from './dtos/UpdateServiceDto';

@Injectable()
export class ServicesService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        return await this.prisma.service.findMany({ where: { deleted_at: null } })
    }

    async create(payload: CreateServiceDto) {
        try {
            return await this.prisma.service.create({ data: payload })
        } catch (err) {
            if (err.code === 'P2002') throw new ConflictException('resource already exists')
            throw err
        }
    }

    async update(payload: UpdateServiceDto, id: string) {
        try {
            return await this.prisma.service.update({
                where: { id, deleted_at: null },
                data: payload
            })
        } catch (err) {
            if (err.code === 'P2002') throw new ConflictException('resource already exists')
            if (err.code === 'P2025') throw new NotFoundException('resource not found')
            throw err
        }
    }

    async delete(id: string) {
        try {
            return await this.prisma.service.update({
                where: { id, deleted_at: null },
                data: { deleted_at: new Date() }
            })
        } catch (err) {
            if (err.code === 'P2025') throw new NotFoundException('resource not found')
            throw err
        }
    }
}
