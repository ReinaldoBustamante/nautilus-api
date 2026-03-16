import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { JWTAdapter } from 'src/common/adapters/jwt.adapter';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SchedulesController],
  providers: [SchedulesService, JWTAdapter, PrismaService],
})
export class SchedulesModule { }
