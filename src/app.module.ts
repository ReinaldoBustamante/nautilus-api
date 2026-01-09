import { Module } from '@nestjs/common';

import { SpecializationModule } from './specialization/specialization.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ServiceModule } from './service/service.module';
import { PatientModule } from './patient/patient.module';
import { DoctorModule } from './doctor/doctor.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
    }),
    SpecializationModule, 
    SpecializationModule, 
    AuthModule, ServiceModule, PatientModule, DoctorModule, UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
