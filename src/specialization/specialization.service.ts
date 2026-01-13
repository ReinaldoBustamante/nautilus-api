import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateSpecializationDto } from './dtos/createSpecialization.dto';

@Injectable()
export class SpecializationService {
    constructor(private readonly prisma: PrismaService) { }
    findAll() {
        return this.prisma.specialization.findMany();
    }

    findServicesBySpecializationId(id: string) {
        return this.prisma.service.findMany({
            where: { specialization_id: id },
            select: { id: true, name: true, description: true, price: true, created_at: true }
        })
    }

    create(payload: CreateSpecializationDto) {
        return this.prisma.specialization.create({ data: payload })
    }
    async delete(id: string) {
        try {
            return await this.prisma.specialization.delete({ where: { id } })
        } catch (err) {
            if (err.code === 'P2025') throw new NotFoundException('User not found')
            throw err
        }
    }
    
}
