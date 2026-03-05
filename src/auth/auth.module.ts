import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JWTAdapter } from 'src/common/adapters/jwt.adapter';
import { PrismaService } from 'src/prisma.service';
import { BcryptAdapter } from 'src/common/adapters/bcrypt.adapter';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JWTAdapter, PrismaService, BcryptAdapter],
})
export class AuthModule {}
