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

    async findServicesByDoctor(id: string) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { id, deleted_at: null },
            include: {
                specialization: {
                    include: {
                        service: {
                            where: {
                                deleted_at: null
                            }
                        }
                    }
                }
            },
        })
        if (!doctor) throw new NotFoundException('resource not found')
        return {
            id: doctor.id,
            name: doctor.name,
            services: doctor.specialization?.service ?? []
        }
    }

    async findScheduleByDoctor(id: string) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { id, deleted_at: null },
            include: {
                doctor_schedule: true
            },
        })
        if (!doctor) throw new NotFoundException('resource not found')
        return {
            id: doctor.id,
            name: doctor.name,
            schedule: doctor.doctor_schedule ?? []
        }
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
