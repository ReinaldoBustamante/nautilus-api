import { Injectable} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateSpecializationDto } from './dtos/createSpecialization.dto';

@Injectable()
export class SpecializationService {
    constructor(private readonly prisma: PrismaService){}
    findAll(){
        return this.prisma.specialization.findMany();
    }
    create(payload: CreateSpecializationDto){
        return this.prisma.specialization.create({ data: payload })
    }
    delete(id: string){
        return this.prisma.specialization.delete({ where: { id } })
    }
}
