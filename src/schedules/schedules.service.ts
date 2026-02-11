import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduleDto } from './dtos/CreateScheduleDto';
import { PrismaService } from 'src/prisma.service';
import { error } from 'node:console';
import { UpdateScheduleDto } from './dtos/UpdateScheduleDto';

@Injectable()
export class SchedulesService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(userId: string) {
        try {
            const schedule = await this.prisma.doctor_schedule.findMany({
                where: { doctor: { user_id: userId } }
            })
            return schedule
        } catch (err) {
            console.log(err)
            if (err) throw err
        }
    }
    
    async create(payload: CreateScheduleDto, userId: string) {
        const doctor = await this.prisma.doctor.findFirst({
            where: { user_id: userId },
            select: { id: true }
        })
        if (!doctor) throw new NotFoundException('usern not found')
        const { day_of_week, ...rest } = payload

        try {
            const schedule = await this.prisma.doctor_schedule.create({
                data: {
                    doctor_id: doctor.id,
                    day_of_week: Number(day_of_week),
                    ...rest
                }
            })
            return schedule
        } catch (err) {
            console.log(err)
            if (err) throw err
        }
    }

    async delete(userId: string, id: string) {
        try {
            const schedule = await this.prisma.doctor_schedule.delete({ where: { id, doctor: { user_id: userId } } })
            return schedule
        } catch (err) {
            console.log(err)
            throw error
        }
    }

    async update(userId: string, id: string, payload: UpdateScheduleDto) {
        try {
            const schedule = await this.prisma.doctor_schedule.update({
                where: { id, doctor: { user_id: userId } },
                data: {
                    ...payload,
                    updated_at: new Date()
                }
            })
            return schedule
        } catch (err) {
            console.log(err)
            throw error
        }
    }
}
