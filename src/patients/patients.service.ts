import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePatientDto } from './dtos/CreatePatientDto';
import { UpdatePatientDto } from './dtos/UpdatePatientDto';

@Injectable()
export class PatientsService {

    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        return await this.prisma.patient.findMany({
            where: { deleted_at: null }
        })
    }

    async create(payload: CreatePatientDto) {
        try {
            return await this.prisma.patient.create({
                data: payload
            })
        } catch (err) {
            if (err.code === 'P2002') throw new ConflictException('resource already exists')
            throw err
        }
    }

    async update(id: string, payload: UpdatePatientDto) {
        try {
            return await this.prisma.patient.update({
                where: { id, deleted_at: null },
                data: payload
            })
        } catch (err) {
            if (err.code === 'P2025') throw new NotFoundException('resource not found')
            throw err
        }
    }

    async delete(id: string) {
        try {
            return await this.prisma.patient.update({
                where: { id, deleted_at: null },
                data: {
                    deleted_at: new Date()
                }
            })
        } catch (err) {
            if (err.code === 'P2025') throw new NotFoundException('resource not found')
            throw err
        }
    }
}
