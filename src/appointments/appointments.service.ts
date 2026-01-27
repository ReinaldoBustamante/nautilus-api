import {  ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateAppointmentDto } from './dtos/CreateAppointmentDto';

@Injectable()
export class AppointmentsService {

    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        return await this.prisma.appointment.findMany()
    }

    async create(payload: CreateAppointmentDto) {
        try {
            return await this.prisma.appointment.create({
                data: payload
            })
        } catch (err) {
            if (err.code === 'P2002') throw new ConflictException('resource already exists')
            throw err
        }
    }
}
