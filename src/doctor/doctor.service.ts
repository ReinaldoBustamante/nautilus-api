import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateDoctorDto } from './dtos/CreateDoctorDto';
import { UpdateDoctorDto } from './dtos/UpdateDoctorDto';

@Injectable()
export class DoctorService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        return this.prisma.doctor.findMany()
    }

    async create(payload: CreateDoctorDto) {
        try {
            return await this.prisma.doctor.create({
                data: payload
            })
        } catch (error) {
            if (error.code === 'P2002') throw new ConflictException('user_id, rut or phonenumber already exist')
            throw error
        }
    }

    async update(payload: UpdateDoctorDto, id: string) {
        return await this.prisma.doctor.update({
            where: { id },
            data: payload
        })
    }

}
