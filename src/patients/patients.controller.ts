import { Controller, Get, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { role_type } from 'prisma/generated/enums';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) { }

  @ApiOperation({ description: '**Requiere rol ADMIN o DOCTOR** \n\nRetorna una lista completa de los pacientes registrados en el sistema.'})
  @Roles(role_type.ADMIN, role_type.DOCTOR)
  @Get()
  findAll(@Req() req: Request) {
    return this.patientsService.findAll(req);
  }

  @ApiOperation({ description: '**Requiere rol DOCTOR** \n\nPermite la modificación parcial de la información de contacto o datos generales de un paciente existente mediante su UUID.'})
  @Roles(role_type.DOCTOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto, @Req() req: Request) {
    const userId = req['user'].id
    return this.patientsService.update(id, updatePatientDto, userId);
  }

  @ApiOperation({ description: '**Requiere rol DOCTOR** \n\nObtiene el listado cronológico de todas las citas médicas asociadas a un paciente específico cuyo doctor sea el que lo solicita.'})
  @Roles(role_type.DOCTOR)
  @Get(':id/appointments')
  findAllPatientAppointments(@Param('id') id: string, @Req() req: Request) {
    const userId = req['user'].id
    return this.patientsService.findAllPatientAppointments(id, userId);
  }
}
