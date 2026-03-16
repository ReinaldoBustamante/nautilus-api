import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { PrismaService } from 'src/prisma.service';
import { JWTAdapter } from 'src/common/adapters/jwt.adapter';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService, PrismaService, JWTAdapter],
})
export class AppointmentModule {}
