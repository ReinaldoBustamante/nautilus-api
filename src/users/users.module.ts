import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { JWTAdapter } from 'src/common/adapters/jwt.adapter';
import { BcryptAdapter } from 'src/common/adapters/bcrypt.adapter';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, JWTAdapter, BcryptAdapter],
})
export class UsersModule {}
