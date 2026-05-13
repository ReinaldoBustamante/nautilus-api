import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { role_type } from 'prisma/generated/enums';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) { }

  @Post()
  @ApiOperation({ description: 'Registra una nueva cita médica asociando un paciente, un doctor y un servicio. Valida disponibilidad y consistencia de los datos antes de su creación.' })
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ description: '**Requiere rol DOCTOR.** \n\nRetorna el listado completo de citas asociadas al doctor autenticado.' })
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role_type.DOCTOR)
  @Get()
  findAll(@Req() req: Request, @Query('date') dateString?: string) {
    const userId = req['user'].id
    return this.appointmentService.findAll(userId, dateString);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ description: '**Requiere rol DOCTOR.** \n\nPermite actualizar el estado de una cita (`CONFIRMED`, `CANCELLED`, `COMPLETED`) y/o agregar notas adicionales.' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role_type.DOCTOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentService.update(id, updateAppointmentDto);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ description: '**Requiere rol DOCTOR.** \n\nEntrega un resumen de los dias donde hay citas, este resumen consta de si hay citas pendientes, aceptadas o completadas' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role_type.DOCTOR)
  @Get('summary')
  getAppointmentSummary(@Req() req: Request, @Query('month') month: number) {
    const userId = req['user'].id
    return this.appointmentService.summary(userId, month)
  }

}
