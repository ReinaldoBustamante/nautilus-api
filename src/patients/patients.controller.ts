import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { user_role_type } from 'generated/prisma/enums';
import { UpdatePatientDto } from './dtos/UpdatePatientDto';
import { CreatePatientDto } from './dtos/CreatePatientDto';

@Controller('patients')
export class PatientsController {
    constructor(private readonly patientsService: PatientsService){}

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(user_role_type.admin)
    @Get() 
    getPatients(){
        return this.patientsService.findAll()
    }

    @Post()
    createPatient(@Body() payload: CreatePatientDto){
        return this.patientsService.create(payload)
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(user_role_type.admin)
    @Patch(':id')
    updatePatient(@Param('id') id: string, @Body() payload: UpdatePatientDto){
        return this.patientsService.update(id, payload)
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(user_role_type.admin)
    @Delete(':id')
    deletePatient(@Param('id') id: string){
        return this.patientsService.delete(id)
    }
}
