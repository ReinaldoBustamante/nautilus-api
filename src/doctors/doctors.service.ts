import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateDoctorDto } from './dtos/CreateDoctorDto';
import { UpdateDoctorDto } from './dtos/UpdateDoctorDto';

@Injectable()
export class DoctorsService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        return await this.prisma.doctor.findMany({
            where: { deleted_at: null }
        });
    }

    async findAvalaibleScheduleByDoctor(id: string) {
       return 'method not exist'
    }

    async create(payload: CreateDoctorDto) {
        try {
            return await this.prisma.doctor.create({
                data: payload
            })
        } catch (err) {
            if (err.code === 'P2002') throw new ConflictException('resource already exists')
            throw err
        }
    }

    async update(payload: UpdateDoctorDto, id: string) {
        try {
            return await this.prisma.doctor.update({
                where: { id, deleted_at: null },
                data: {
                    ...payload,
                    updated_at: new Date()
                }
            })
        } catch (err) {
            if (err.code === 'P2025') throw new NotFoundException('resource not found')
            throw err
        }
    }

    async delete(id: string) {
        try {
            return await this.prisma.doctor.update({
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
