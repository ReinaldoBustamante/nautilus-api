import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { BcryptAdapter } from 'src/auth/adapters/bcrypt.adapter';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, BcryptAdapter]
})
export class UsersModule {}
