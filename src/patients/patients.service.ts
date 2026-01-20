import { ConflictException, Injectable } from '@nestjs/common';
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
            const fields = err.meta.driverAdapterError.cause.constraint.fields
            if (fields.includes('rut')) throw new ConflictException('rut already exist')
            throw err
        }
    }

    async update(id: string, payload: UpdatePatientDto) {
        return await this.prisma.patient.update({
            where: { id },
            data: payload
        })
    }

    async delete(id: string) {
        return await this.prisma.patient.update({
            where: { id },
            data: {
                deleted_at: new Date()
            }
        })
    }
}
