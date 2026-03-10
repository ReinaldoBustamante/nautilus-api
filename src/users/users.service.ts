import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const user = await this.prismaService.user.create({
      data: createUserDto
    })

    return user
  }

  async findAll() {
    const users = await this.prismaService.user.findMany()
    return users
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prismaService.user.update({
      where: {
        id: id
      },
      data: updateUserDto
    })
    return user
  }

}
