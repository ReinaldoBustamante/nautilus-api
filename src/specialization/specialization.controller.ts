import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { SpecializationService } from './specialization.service';
import { CreateSpecializationDto } from './dtos/createSpecialization.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/roles.enum';

@Controller('specialization')
export class SpecializationController {
    constructor(
        private readonly specializationService: SpecializationService,
    ) { }

    @Get('')
    findSpecializations() {
        return this.specializationService.findAll()
    }
    @Get(':id/services')
    findServicesBySpecialiation(@Param('id') id: string){
        return this.specializationService.findServicesBySpecializationId(id)
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post('')
    createSpecialization(@Body() payload: CreateSpecializationDto) {
        return this.specializationService.create(payload)
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    deleteSpecialization(@Param('id') id: string) {
        return this.specializationService.delete(id)
    }
}
