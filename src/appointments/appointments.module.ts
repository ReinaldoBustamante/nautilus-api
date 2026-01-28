import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from 'src/prisma.service';
import { BcryptAdapter } from 'src/auth/adapters/bcrypt.adapter';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService, PrismaService, BcryptAdapter]
})
export class AppointmentsModule {}
