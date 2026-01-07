import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SpecializationService } from './specialization.service';
import { CreateSpecializationDto } from './dtos/createSpecialization.dto';

@Controller('specialization')
export class SpecializationController {
    constructor(private readonly specializationService: SpecializationService){}

    @Get()
    findSpecializations(){
        return this.specializationService.findAll()
    }

    @Post()
    createSpecialization(@Body() payload: CreateSpecializationDto){
        return this.specializationService.create(payload)
    }

    @Delete(':id')
    deleteSpecialization(@Param('id') id: string){
        return this.specializationService.delete(id)
    }
}
