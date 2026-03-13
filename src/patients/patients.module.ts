import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { PrismaService } from 'src/prisma.service';
import { JWTAdapter } from 'src/common/adapters/jwt.adapter';
import { PatientsStrategyContext } from './strategies/patients-search.context';
import { AdminPatientsStrategy } from './strategies/impl/admin-search.strategy';
import { DoctorPatientsStrategy } from './strategies/impl/doctor-search.strategy';


@Module({
  controllers: [PatientsController],
  providers: [
    PatientsService, 
    PrismaService, 
    JWTAdapter, 
    PatientsStrategyContext, 
    AdminPatientsStrategy,
    DoctorPatientsStrategy,
  ],
})
export class PatientsModule {}
