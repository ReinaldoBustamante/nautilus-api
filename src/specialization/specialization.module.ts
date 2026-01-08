import { Module } from '@nestjs/common';
import { SpecializationController } from './specialization.controller';
import { SpecializationService } from './specialization.service';
import { PrismaService } from 'src/prisma.service';
import { RoleService } from 'src/roles.service';

@Module({
  controllers: [SpecializationController],
  providers: [SpecializationService, PrismaService, RoleService]
})
export class SpecializationModule {}
