import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateSpecializationDto } from './dtos/CreateSpecializationDto';
import { UpdateSpecializationDto } from './dtos/UpdateSpecializationDto';
import { SpecializationsService } from './specializations.service';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { user_role_type } from 'generated/prisma/enums';

@UseGuards(AuthGuard, RolesGuard)
@Roles(user_role_type.admin)
@Controller('specializations')
export class SpecializationsController {
    constructor(private readonly specializationsService: SpecializationsService) { }

    @Get('')
    getSpecialization() {
        return this.specializationsService.findAll()
    }

    @Get(':id/services')
    getSpecializationServices(@Param('id') id: string) {
        return this.specializationsService.findAllServicesBySpecialization(id)
    }

    @Post('')
    createSpecialization(@Body() payload: CreateSpecializationDto) {
        return this.specializationsService.create(payload)
    }

    @Patch(':id')
    updateSpecialization(@Param('id') id: string, @Body() payload: UpdateSpecializationDto) {
        return this.specializationsService.update(id, payload)
    }

    @Delete(':id')
    deleteSpecialization(@Param('id') id: string) {
        return this.specializationsService.delete(id)
    }
}
