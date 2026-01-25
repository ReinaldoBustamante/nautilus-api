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

    async findAvalaibleScheduleByDoctor(id: string, isoDate: string) {

        const selectedDate = new Date(isoDate);

        const dayOfWeek = selectedDate.getUTCDay();
        const startOfDay = new Date(isoDate);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(isoDate);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const appointments = await this.prisma.appointment.findMany({
            where: {
                doctor_id: id,
                appointment_date: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            select: { appointment_date: true }
        });

        const occupiedTimes = new Set(
            appointments.map(appointment => appointment.appointment_date.toISOString().slice(11, 16))
        );

        const baseSchedules = await this.prisma.doctor_schedule.findMany({
            where: {
                doctor_id: id,
                day_of_week: dayOfWeek
            }
        });

        return baseSchedules.filter(schedule => {
           
            const timeKey = schedule.start_time.toISOString().slice(11, 16);
            return !occupiedTimes.has(timeKey);
        });



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
