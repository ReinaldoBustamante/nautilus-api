import { Injectable } from '@nestjs/common';
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
        return await this.prisma.service.create({ data: payload })
    }

    async update(payload: UpdateServiceDto, id: string) {
        return await this.prisma.service.update({
            where: { id },
            data: payload
        })
    }

    async delete(id: string) {
        return await this.prisma.service.update({
            where: { id },
            data: { deleted_at: new Date() }
        })
    }

}
