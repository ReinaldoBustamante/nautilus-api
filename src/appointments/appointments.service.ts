import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RegisterAppointmentDto } from './dtos/RegisterAppointmentDto';
import { BcryptAdapter } from 'src/auth/adapters/bcrypt.adapter';

@Injectable()
export class AppointmentsService {

    constructor(private readonly prisma: PrismaService, private readonly bcryptAdapter: BcryptAdapter) { }

    async findAll(doctorID: string) {
        return await this.prisma.appointment.findMany({
            where: {
                doctor_id: doctorID
            }
        })
    }

    async register(payload: RegisterAppointmentDto) {
        const result = await this.prisma.$transaction(async (tx) => {

            let patient = await tx.patient.findFirst({
                where: { rut: payload.rut, deleted_at: null }
            })

            if (!patient) {

                patient = await tx.patient.create({
                    data: {
                        name: payload.name,
                        rut: payload.rut,
                        default_phone_number: payload.phone_number,
                        default_address: payload.address,
                        user_id: null
                    }
                })
            }

            const appointment = await tx.appointment.create({
                data: {
                    patient_id: patient.id,
                    doctor_id: payload.doctor_id,
                    address_snapshot: payload.address,
                    email_snapshot: payload.email,
                    phone_number_snapshot: payload.phone_number,
                    appointment_date: payload.date,
                    comment: payload.comment
                }
            })

            return appointment
        })

        return result
    }
}
