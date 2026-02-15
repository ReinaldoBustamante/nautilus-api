import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DoctorsModule } from './doctors/doctors.module';
import { PatientsModule } from './patients/patients.module';
import { SpecializationsModule } from './specializations/specializations.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { SchedulesModule } from './schedules/schedules.module';


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
    AppointmentsModule,
    SchedulesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
