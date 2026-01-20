import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateSpecializationDto } from './dtos/CreateSpecializationDto';
import { UpdateSpecializationDto } from './dtos/UpdateSpecializationDto';

@Injectable()
export class SpecializationsService {
    constructor(private readonly prisma: PrismaService) { }
    async findAll() {
        return await this.prisma.specialization.findMany({ where: { deleted_at: null } })
    }

    async findAllServicesBySpecialization(id: string) {
        const specialization = await this.prisma.specialization.findUnique({
            where: { id },
            include: { service: true }
        })
        if (!specialization) throw new NotFoundException('specialization not found')
        return {
            id: specialization.id,
            name: specialization.name,
            services: specialization.service
        }
    }

    async create(payload: CreateSpecializationDto) {
        return await this.prisma.specialization.create({
            data: payload
        })
    }

    async update(id: string, payload: UpdateSpecializationDto) {
        return await this.prisma.specialization.update({
            where: { id },
            data: {
                ...payload,
                updated_at: new Date()
            }
        })
    }

    async delete(id: string) {
        return await this.prisma.specialization.update({
            where: { id },
            data: { deleted_at: new Date() }
        })
    }
}
