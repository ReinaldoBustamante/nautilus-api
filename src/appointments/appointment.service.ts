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
            lastname: createAppointmentDto.patient_lastname,
            rut: createAppointmentDto.patient_rut,
            birthday: createAppointmentDto.patient_birthday,
            address: createAppointmentDto.address_snapshot,
            phone_number: createAppointmentDto.phone_snapshot,
            email: createAppointmentDto.patient_email,
            created_at: new Date()
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

  async findAll(userId: string, dateString?: string) {
    try {
      // 1. Buscamos primero al doctor
      const doctor = await this.prismaService.doctor.findUnique({
        where: { user_id: userId }
      });

      if (!doctor) throw new UnauthorizedException('user not found');

      // 2. Construimos el filtro base
      const where: any = {
        doctor_id: doctor.id
      };

      // 3. Agregamos el filtro de fecha solo si viene el parámetro
      if (dateString) {
        const startOfDay = new Date(`${dateString}T00:00:00.000Z`);
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);

        where.appointment_date = {
          gte: startOfDay,
          lt: endOfDay,
        };
      }

      // 4. Ejecutamos la búsqueda con el filtro dinámico
      const appointments = await this.prismaService.appointment.findMany({
        where,
        include: {
          patient: true
        }
      });

      return appointments;

    } catch (err) {
      const handler = prismaErrorMap[err.code];
      if (handler) throw handler();
      throw err;
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

  async summary(id: string, month: number) {
    const today = new Date()
    const startDate = new Date(today.getFullYear(), month, 1);
    const endDate = new Date(today.getFullYear(), month + 1, 0, 23, 59, 59);
    try {
      const appointments = await this.prismaService.appointment.findMany({
        where: {
          doctor: { user_id: id },
          appointment_date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { appointment_date: 'asc' }
      })

      const summary = appointments.reduce((acc, appt) => {
        // Extraemos la fecha (YYYY-MM-DD)
        const dateKey = appt.appointment_date.toISOString().split('T')[0];

        if (!acc[dateKey]) {
          acc[dateKey] = { pending: 0, completed: 0, accepted: 0 };
        }

        if (appt.status === 'PENDING') acc[dateKey].pending++;
        if (appt.status === 'COMPLETED') acc[dateKey].completed++;
        if (appt.status === 'ACCEPTED') acc[dateKey].accepted++;

        return acc;
      }, {} as Record<string, { pending: number; completed: number; accepted: number }>)

      return summary

    } catch (err) {
      const handler = prismaErrorMap[err.code]
      if (handler) throw handler()
      throw err
    }
  }
}
