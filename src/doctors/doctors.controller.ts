import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dtos/CreateDoctorDto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { user_role_type } from 'generated/prisma/enums';
import { UpdateDoctorDto } from './dtos/UpdateDoctorDto';

@Controller('doctors')
export class DoctorsController {
    constructor(private readonly doctorService: DoctorsService) { }

    @Get('')
    getDoctors() {
        return this.doctorService.findAll()
    }
    
    @Get(':id/schedule')
    getDoctorSchedule(@Param('id') id: string, @Query('date') isoDate: string) {
        return this.doctorService.findAvalaibleScheduleByDoctor(id, isoDate)
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(user_role_type.admin)
    @Post('')
    createDoctor(@Body() payload: CreateDoctorDto) {
        return this.doctorService.create(payload)
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(user_role_type.admin)
    @Patch(':id')
    updateDoctor(@Body() payload: UpdateDoctorDto, @Param('id') id: string) {
        return this.doctorService.update(payload, id)
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(user_role_type.admin)
    @Delete(':id')
    deleteDoctor(@Param('id') id: string) {
        return this.doctorService.delete(id)
    }


}
