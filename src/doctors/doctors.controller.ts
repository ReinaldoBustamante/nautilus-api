import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { role_type } from 'prisma/generated/enums';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role_type.ADMIN)
  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  findAll() {
    return this.doctorsService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role_type.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @Get(':id/schedules')
  findAllDoctorSchedules(@Param('id') id: string) {
    return this.doctorsService.findAllDoctorSchedules(id)
  }
  @Get(':id/occupied-schedules')
  findAllOccupiedDoctorSchedules(@Param('id') id: string) {
    return this.doctorsService.findAllOccupiedDoctorSchedules(id)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role_type.ADMIN)
  @Get(':id/appointments')
  findAllDoctorAppointments(@Param('id') id: string) {
    return this.doctorsService.findAllDoctorAppointments(id)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role_type.ADMIN)
  @Get(':id/patients')
  findAllDoctorPatients(@Param('id') id: string) {
    return this.doctorsService.findAllDoctorPatients(id)
  }
}
