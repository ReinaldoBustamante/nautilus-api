import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { user_role_type } from 'generated/prisma/enums';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { CreateScheduleDto } from './dtos/CreateScheduleDto';
import { SchedulesService } from './schedules.service';
import { UpdateScheduleDto } from './dtos/UpdateScheduleDto';


@Controller('schedules')
export class SchedulesController {
    constructor(private readonly schedulesService: SchedulesService) { }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(user_role_type.doctor)
    @Get('')
    findSchedules(@Req() req: Request) {
        const userId = req["user"].sub
        if (!userId) throw new NotFoundException('User not found')

        return this.schedulesService.findAll(userId)
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(user_role_type.doctor)
    @Post('')
    createSchedule(@Body() payload: CreateScheduleDto, @Req() req: Request) {
        const userId = req["user"].sub
        if (!userId) throw new NotFoundException('User not found')

        return this.schedulesService.create(payload, userId)
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(user_role_type.doctor)
    @Delete(':id')
    deleteSchedule(@Param('id') id: string, @Req() req: Request) {
        const userId = req["user"].sub
        if (!userId) throw new NotFoundException('User not found')

        return this.schedulesService.delete(userId, id)
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(user_role_type.doctor)
    @Patch(':id')
    updateSchedule(@Param('id') id: string, @Req() req: Request, @Body() payload: UpdateScheduleDto) {
        const userId = req["user"].sub
        if (!userId) throw new NotFoundException('User not found')

        return this.schedulesService.update(userId, id, payload)
    }
}
