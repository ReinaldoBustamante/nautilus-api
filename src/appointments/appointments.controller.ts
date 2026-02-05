import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { user_role_type } from 'generated/prisma/enums';
import { RegisterAppointmentDto } from './dtos/RegisterAppointmentDto';

@Controller('appointments')
export class AppointmentsController {

    constructor( private readonly appointmentsService: AppointmentsService){}

    @Get('')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(user_role_type.admin, user_role_type.doctor)
    findAppointments(@Query('doctorID') doctor_id: string){
        return this.appointmentsService.findAll(doctor_id)
    }

    @Post('/register')
    registerAppointment(@Body() payload: RegisterAppointmentDto){
        return this.appointmentsService.register(payload)
    }
}
