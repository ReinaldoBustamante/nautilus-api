import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateDoctorDto } from './dtos/CreateDoctorDto';
import { UpdateDoctorDto } from './dtos/UpdateDoctorDto';

@Injectable()
export class DoctorsService {

    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        return await this.prisma.doctor.findMany();
    }

    async findServicesByDoctor(id: string) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { id },
            include: {
                specialization: {
                    include: {
                        service: true
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
            where: { id },
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
            if (err.code === 'P2002') throw new ConflictException('A unique field already exists in the database')
            throw err
        }
    }

    async update(payload: UpdateDoctorDto, id: string) {

        const doctor = await this.prisma.doctor.findUnique({where: { id }})
        if (doctor?.deleted_at !== null) throw new NotFoundException('resource not found')
        return await this.prisma.doctor.update({
            where: {id},
            data: {
                ...payload,
                updated_at: new Date()
            }
        })
    }

    async delete(id: string) {
        return this.prisma.doctor.update({
            where: { id },
            data: {
                deleted_at: new Date()
            }
        })
    }


}
