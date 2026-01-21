import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

        const specialization = await this.prisma.specialization.findFirst({
            where: { id, deleted_at: null },
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
        try {
            return await this.prisma.specialization.create({
                data: payload
            })
        } catch (err) {
            if (err.code === 'P2002') throw new ConflictException('resource already exists')
            throw err
        }
    }

    async update(id: string, payload: UpdateSpecializationDto) {
        try {
            return await this.prisma.specialization.update({
                where: { id, deleted_at: null },
                data: {
                    ...payload,
                    updated_at: new Date()
                }
            })
        } catch (err) {
            if (err.code === 'P2002') throw new ConflictException('resource already exists')
            if (err.code === 'P2025') throw new NotFoundException('resource not found')
            throw err
        }
    }

    async delete(id: string) {
        try {
            return await this.prisma.specialization.update({
                where: { id, deleted_at: null },
                data: { deleted_at: new Date() }
            })
        } catch (err) {
            if (err.code === 'P2025') throw new NotFoundException('resource not found')
            throw err
        }
    }
}
