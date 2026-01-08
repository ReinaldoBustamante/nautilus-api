import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BcryptAdapter } from './adapters/bcrypt.adapter';
import { PrismaService } from 'src/prisma.service';
import { RoleService } from 'src/roles.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, BcryptAdapter, PrismaService, RoleService]
})
export class AuthModule {}
