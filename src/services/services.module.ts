import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { PrismaService } from 'src/prisma.service';
import { JWTAdapter } from 'src/common/adapters/jwt.adapter';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService, PrismaService, JWTAdapter],
})
export class ServicesModule { }
