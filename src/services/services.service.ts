import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from 'src/prisma.service';
import { prismaErrorMap } from 'src/common/errors/prisma.errors';

@Injectable()
export class ServicesService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createServiceDto: CreateServiceDto) {
    try {
      const service = await this.prismaService.service.create({
        data: {
          ...createServiceDto,
          created_at: new Date()
        }
      })
      return service
    } catch (err) {
      const handler = prismaErrorMap[err.code]
      if (handler) throw handler()
      throw err
    }
  }

  async findAll() {
    try {
      const services = await this.prismaService.service.findMany()
      return services
    } catch (err) {
      const handler = prismaErrorMap[err.code]
      if (handler) throw handler()
      throw err
    }
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    try {
      const service = await this.prismaService.service.update({
        where: { id },
        data: updateServiceDto
      })

      return service
    } catch (err) {
      const handler = prismaErrorMap[err.code]
      if (handler) throw handler()
      throw err
    }
  }

}
