import { Module } from '@nestjs/common';


import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

import { UserModule } from './user/user.module';
import { ServiceModule } from './service/service.module';
import { SpecializationModule } from './specialization/specialization.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SpecializationModule,
    AuthModule,
    UserModule,
    ServiceModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
