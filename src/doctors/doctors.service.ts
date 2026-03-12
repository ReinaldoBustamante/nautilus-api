import { Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { prismaErrorMap } from 'src/common/errors/prisma.errors';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DoctorsService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createDoctorDto: CreateDoctorDto) {
    try {
      const doctor = await this.prismaService.doctor.create({
        data: {
          ...createDoctorDto,
          created_at: new Date()
        }
      })
      return doctor
    } catch (err) {
      const handler = prismaErrorMap[err.code]
      if (handler) throw handler()
      throw err
    }
  }

  async findAll() {
    try {
      const doctors = await this.prismaService.doctor.findMany()
      return doctors
    } catch (err) {
      const handler = prismaErrorMap[err.code]
      if (handler) throw handler()
      throw err
    }
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto) {
    try {
      const doctor = await this.prismaService.doctor.update({
        where: { id },
        data: updateDoctorDto
      })
      return doctor
    } catch (err) {
      const handler = prismaErrorMap[err.code]
      if (handler) throw handler()
      throw err
    }
  }

  async findAllDoctorSchedules(id: string) {
    try {
      const schedules = await this.prismaService.schedule.findMany({
        where: { doctor_id: id }
      })
      return schedules
    } catch (err) {
      const handler = prismaErrorMap[err.code]
      if (handler) throw handler()
      throw err
    }
  }
  async findAllOccupiedDoctorSchedules(id: string) {
    try {
      return await this.prismaService.appointment.findMany({
        where: {
          doctor_id: id,
          appointment_date: {
            gte: new Date(),
          },
        },
        select: {
          appointment_date: true,
        }
      });
    } catch (err) {
      const handler = prismaErrorMap[err.code]
      if (handler) throw handler()
      throw err
    }
  }


  async findAllDoctorAppointments(id: string) {
    try {
      const appointments = await this.prismaService.appointment.findMany({
        where: { doctor_id: id }
      })
      return appointments
    } catch (err) {
      const handler = prismaErrorMap[err.code]
      if (handler) throw handler()
      throw err
    }
  }

  async findAllDoctorPatients(id: string) {
    try {
      const patients = await this.prismaService.patient.findMany({
        where: { appointment: { some: { doctor_id: id } } },
        distinct: ['id']
      })
      return patients
    } catch (err) {
      const handler = prismaErrorMap[err.code]
      if (handler) throw handler()
      throw err
    }
  }
}
