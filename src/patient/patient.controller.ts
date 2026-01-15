import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { PatientService } from './patient.service';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Role } from 'src/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreatePatientDto } from './dtos/CreatePatientDto';

@Controller('patient')
export class PatientController {
    constructor (private readonly patientService: PatientService){}

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get('')
    getPatients(){
        return this.patientService.findAll()
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get('')
    createPatient(@Body() payload: CreatePatientDto){
        return this.patientService.create(payload)
    }

}
