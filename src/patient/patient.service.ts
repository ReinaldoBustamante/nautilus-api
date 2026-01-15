import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePatientDto } from './dtos/CreatePatientDto';

@Injectable()
export class PatientService {
    constructor(private readonly prisma: PrismaService){}

    findAll(){
        return this.prisma.patient.findMany();
    }

    create(payload: CreatePatientDto){
        return this.prisma.patient.create({
            data: payload
        })
    }
}
