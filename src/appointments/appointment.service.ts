import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { prismaErrorMap } from 'src/common/errors/prisma.errors';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AppointmentService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createAppointmentDto: CreateAppointmentDto) {
    try {
      const patient = await this.prismaService.patient.findUnique({ where: { rut: createAppointmentDto.patient_rut } })
      if (!patient) {
        const newPatient = await this.prismaService.patient.create({
          data: {
            name: createAppointmentDto.patient_name,
            rut: createAppointmentDto.patient_rut,
            address: createAppointmentDto.address_snapshot,
            phone_number: createAppointmentDto.phone_snapshot,
            email: createAppointmentDto.patient_email
          }
        })
        const appointment = await this.prismaService.appointment.create({
          data: {
            patient_id: newPatient.id,
            doctor_id: createAppointmentDto.doctor_id,
            service_id: createAppointmentDto.service_id,
            address_snapshot: createAppointmentDto.address_snapshot,
            appointment_date: createAppointmentDto.appointment_date,
            notes: createAppointmentDto.notes,
            phone_snapshot: createAppointmentDto.phone_snapshot,
            created_at: new Date()
          }
        })
        return appointment
      }
      const appointment = await this.prismaService.appointment.create({
        data: {
          patient_id: patient.id,
          doctor_id: createAppointmentDto.doctor_id,
          service_id: createAppointmentDto.service_id,
          address_snapshot: createAppointmentDto.address_snapshot,
          appointment_date: createAppointmentDto.appointment_date,
          notes: createAppointmentDto.notes,
          phone_snapshot: createAppointmentDto.phone_snapshot,
          created_at: new Date()
        }
      })
      return appointment
    } catch (err) {
      const handler = prismaErrorMap[err.code]
      if (handler) throw handler()
      throw err
    }
  }

  async findAll(userId: string) {
    try {
      const doctor = await this.prismaService.doctor.findUnique({ where: { user_id: userId } })
      if (!doctor) throw new UnauthorizedException('user not found')
      const appointments = await this.prismaService.appointment.findMany({
        where: {
          doctor_id: doctor.id
        }
      })
      return appointments
    } catch (err) {
      const handler = prismaErrorMap[err.code]
      if (handler) throw handler()
      throw err
    }
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    try {
      const appointment = await this.prismaService.appointment.update({
        where: { id },
        data: updateAppointmentDto
      })
      return appointment
    } catch (err) {
      const handler = prismaErrorMap[err.code]
      if (handler) throw handler()
      throw err
    }
  }

}
