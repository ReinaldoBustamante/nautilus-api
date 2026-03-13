import { Controller, Get, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { role_type } from 'prisma/generated/enums';


@UseGuards(AuthGuard, RolesGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) { }

  @Roles(role_type.ADMIN, role_type.DOCTOR)
  @Get()
  findAll(@Req() req: Request) {
    return this.patientsService.findAll(req);
  }

  @Roles(role_type.DOCTOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto, @Req() req: Request) {
    const userId = req['user'].id
    return this.patientsService.update(id, updatePatientDto, userId);
  }

  @Roles(role_type.DOCTOR)
  @Get(':id/appointments')
  findAllPatientAppointments(@Param('id') id: string, @Req() req: Request) {
    const userId = req['user'].id
    return this.patientsService.findAllPatientAppointments(id, userId);
  }
}
