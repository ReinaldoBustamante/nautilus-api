import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { prismaErrorMap } from 'src/common/errors/prisma.errors';
import { PrismaService } from 'src/prisma.service';
import { BulkSyncDto } from './dto/bulk-sync.dto';

@Injectable()
export class SchedulesService {
  constructor(private readonly prismaService: PrismaService) { }
  async create(createScheduleDto: CreateScheduleDto, userId: string) {
    try {
      const doctor = await this.prismaService.doctor.findUnique({
        where: { user_id: userId }
      })
      if (!doctor) throw new UnauthorizedException('invalid user')

      const schedule = await this.prismaService.schedule.create({
        data: {
          ...createScheduleDto,
          doctor_id: doctor.id,
          created_at: new Date().toISOString()
        }
      })
      return schedule
    } catch (err) {
      console.log(err)
      const handler = prismaErrorMap[err.code]
      if (handler) throw handler()
      throw err
    }
  }

  async findAll() {
    try {
      const schedules = await this.prismaService.schedule.findMany()
      return schedules
    } catch (err) {
      const handler = prismaErrorMap[err.code]
      if (handler) throw handler()
      throw err
    }
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    try {
      const schedule = await this.prismaService.schedule.update({
        where: { id },
        data: updateScheduleDto
      })
      return schedule
    } catch (err) {
      const handler = prismaErrorMap[err.code]
      if (handler) throw handler()
      throw err
    }
  }

  async bulkSync(bulkSyncDto: BulkSyncDto, userId: string) {
    try {
      const { schedules } = bulkSyncDto

      const doctor = await this.prismaService.doctor.findUnique({
        where: { user_id: userId }
      })
      if (!doctor) throw new UnauthorizedException('invalid user')

      
      return this.prismaService.$transaction(async (tx) => {
        await this.prismaService.schedule.deleteMany({
          where: { doctor_id: doctor.id }
        });

        await this.prismaService.schedule.createMany({
          data: schedules.map(s => ({
            ...s,
            doctor_id: doctor.id
          }))
        });
      })
  
    } catch (err) {
      console.log(err)
    }
  }

  async remove(id: string) {
    try {
      const schedule = await this.prismaService.schedule.delete({
        where: { id }
      })
      return schedule
    } catch (err) {
      const handler = prismaErrorMap[err.code]
      if (handler) throw handler()
      throw err
    }
  }
}
