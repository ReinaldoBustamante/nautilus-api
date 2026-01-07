import { Module } from '@nestjs/common';

import { SpecializationModule } from './specialization/specialization.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
    }),
    SpecializationModule, 
    SpecializationModule, AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
