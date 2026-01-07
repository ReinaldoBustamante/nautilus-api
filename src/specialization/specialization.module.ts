import { Module } from '@nestjs/common';
import { SpecializationController } from './specialization.controller';
import { SpecializationService } from './specialization.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SpecializationController],
  providers: [SpecializationService, PrismaService]
})
export class SpecializationModule {}
