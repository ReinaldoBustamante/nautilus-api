import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DoctorsModule } from './doctors/doctors.module';
import { PatientsModule } from './patients/patients.module';
import { SpecializationsModule } from './specializations/specializations.module';
import { ServicesModule } from './services/services.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UsersModule,
    DoctorsModule,
    PatientsModule,
    SpecializationsModule,
    ServicesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
