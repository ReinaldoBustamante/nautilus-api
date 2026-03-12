import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { JWTAdapter } from 'src/common/adapters/jwt.adapter';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [DoctorsController],
  providers: [DoctorsService, JWTAdapter, PrismaService],
})
export class DoctorsModule {}
