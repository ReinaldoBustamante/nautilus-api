import { Module } from '@nestjs/common';

import { DoctorsService } from './doctors.service';
import { PrismaService } from 'src/prisma.service';
import { DoctorsController } from './doctors.controller';

@Module({
  controllers: [DoctorsController],
  providers: [DoctorsService, PrismaService]
})
export class DoctorsModule {}
