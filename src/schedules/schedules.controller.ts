import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { role_type } from 'prisma/generated/enums';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';


@ApiBearerAuth('access_token')
@UseGuards(AuthGuard, RolesGuard)
@Roles(role_type.DOCTOR)
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) { }

  @ApiOperation({ description: '**Requiere rol DOCTOR.** \n\nCrea un nuevo bloque de horario laboral'})
  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto, @Req() req: Request) {
    const userId = req['user'].id
    return this.schedulesService.create(createScheduleDto, userId)
  }

  @ApiOperation({ description: '**Requiere rol DOCTOR.** \n\nDevuelve todos los horarios configurados en el sistema.'})
  @Get()
  findAll() {
    return this.schedulesService.findAll();
  }

  @ApiOperation({ description: '**Requiere rol DOCTOR.** \n\nPermite modificar horas o disponibilidad de un bloque horario.'})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto) {
    return this.schedulesService.update(id, updateScheduleDto);
  }

  @ApiOperation({ description: '**Requiere rol DOCTOR.** \n\nElimina un bloque horario del sistema.'})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schedulesService.remove(id);
  }
}
