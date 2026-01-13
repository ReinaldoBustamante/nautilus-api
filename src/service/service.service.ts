import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateServiceDto } from './dtos/CreateServiceDto';
import { UpdateServiceDto } from './dtos/UpdateServiceDto';

@Injectable()
export class ServiceService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        return this.prisma.service.findMany()
    }

    async create(payload: CreateServiceDto) {
        try {
            return await this.prisma.service.create({
                data: payload
            })
        } catch (err) {
            if (err.code === 'P2002') throw new ConflictException('Service already exists')
            if (err.code === 'P2003') throw new ConflictException('specialization not found')
            throw err
        }
    }

    async delete(id: string) {
        return this.prisma.service.delete({
            where: { id }
        })
    }

    async update(payload: UpdateServiceDto, id: string) {
        return await this.prisma.service.update({
            where: { id },
            data: {
                ...payload,
                updated_at: new Date()
            }
        })
    }

}
