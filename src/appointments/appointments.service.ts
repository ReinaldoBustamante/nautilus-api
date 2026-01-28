import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateAppointmentDto } from './dtos/CreateAppointmentDto';
import { RegisterAppointmentDto } from './dtos/RegisterAppointmentDto';
import { BcryptAdapter } from 'src/auth/adapters/bcrypt.adapter';
import { randomBytes } from 'crypto';

@Injectable()
export class AppointmentsService {

    constructor(private readonly prisma: PrismaService, private readonly bcryptAdapter: BcryptAdapter) { }

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

    async register(payload: RegisterAppointmentDto) {
        const result = await this.prisma.$transaction(async (tx) => {

            let patient = await tx.patient.findFirst({
                where: { rut: payload.rut, deleted_at: null }
            })

            if (!patient) {
                const user =
                    await tx.user.findFirst({ where: { email: payload.email, deleted_at: null } }) ??
                    await tx.user.create({
                        data: { email: payload.email, password: null, user_status: 'inactive' }
                    })

                patient = await tx.patient.create({
                    data: {
                        name: payload.name,
                        rut: payload.rut,
                        phone_number: payload.phone_number,
                        default_address: payload.address,
                        user_id: user.id
                    }
                })
            }

            const appointment = await tx.appointment.create({
                data: {
                    patient_id: patient.id,
                    doctor_id: payload.doctor_id,
                    address_snapshot: payload.address,
                    appointment_date: payload.date,
                    comment: payload.comment
                }
            })

            return appointment
        })

        return result
    }
}
