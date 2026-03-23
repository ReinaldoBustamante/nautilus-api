import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { prismaErrorMap } from 'src/common/errors/prisma.errors';
import { BcryptAdapter } from 'src/common/adapters/bcrypt.adapter';

const USER_SELECT_FIELDS = {
  id: true,
  email: true,
  role: true,
  status: true,
  created_at: true,
  updated_at: true,
};

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bcryptAdapter: BcryptAdapter
  ) { }

  async create(createUserDto: CreateUserDto){
    const { password, ...restUser } = createUserDto
    try {
      const user = await this.prismaService.user.create({
        data: {
          ...restUser,
          password: await this.bcryptAdapter.encryptPassword(password),
          created_at: new Date()
        }
      })
      const { password: passwordHashed, ...userCreate } = user
      return userCreate
    } catch (err) {
      const handler = prismaErrorMap[err.code]
      if (handler) throw handler()
      throw err
    }
  }

  async findAll() {
    try {
      const users = await this.prismaService.user.findMany({
        select: USER_SELECT_FIELDS
      })
      return users
    } catch (err) {
      const handler = prismaErrorMap[err.code]
      if (handler) throw handler()
      throw err
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prismaService.user.update({
        where: {
          id: id
        },
        data: updateUserDto
      })
      return user
    } catch (err) {
      const handler = prismaErrorMap[err.code]
      if (handler) throw handler()
      throw err
    }
  }

}
