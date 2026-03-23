import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { role_type } from 'prisma/generated/enums';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) { }

  @ApiOperation({ description: '**Requiere rol ADMIN.** \n\nRegistra un nuevo doctor en el sistema utilizando la información proporcionada.' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role_type.ADMIN)
  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @ApiOperation({ description: 'Retorna la lista de doctores registrados en el sistema junto con su información profesional básica.' })
  @Get()
  findAll() {
    return this.doctorsService.findAll();
  }

  @ApiOperation({ description: '**Requiere rol ADMIN.** \n\n Permite actualizar la información de un doctor' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role_type.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @ApiOperation({ description: 'Retorna los bloques de disponibilidad laboral configurados para el doctor.' })
  @Get(':id/schedules')
  findAllDoctorSchedules(@Param('id') id: string) {
    return this.doctorsService.findAllDoctorSchedules(id)
  }

  @ApiOperation({ description: 'Retorna los bloques de horario que ya se encuentran ocupados por citas médicas para el doctor.' })
  @Get(':id/occupied-schedules')
  findAllOccupiedDoctorSchedules(@Param('id') id: string) {
    return this.doctorsService.findAllOccupiedDoctorSchedules(id)
  }

  @ApiOperation({ description: '**Requiere rol ADMIN.** \n\nDevuelve todas las citas asociadas a un doctor especifico' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role_type.ADMIN)
  @Get(':id/appointments')
  findAllDoctorAppointments(@Param('id') id: string) {
    return this.doctorsService.findAllDoctorAppointments(id)
  }

  @ApiOperation({ description: '**Requiere rol ADMIN.** \n\nDevuelve la lista de pacientes que han tenido al menos una cita médica con un doctor especifico.' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role_type.ADMIN)
  @Get(':id/patients')
  findAllDoctorPatients(@Param('id') id: string) {
    return this.doctorsService.findAllDoctorPatients(id)
  }
}
