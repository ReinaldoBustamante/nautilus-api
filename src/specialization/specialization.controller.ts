import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { SpecializationService } from './specialization.service';
import { CreateSpecializationDto } from './dtos/createSpecialization.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RoleName, RoleService } from 'src/roles.service';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Controller('specialization')
export class SpecializationController {
    constructor(
        private readonly specializationService: SpecializationService,
        private readonly roleService: RoleService
    ) { }

    @Get()
    findSpecializations() {
        return this.specializationService.findAll()
    }

    @Post()
    @UseGuards(AuthGuard)
    createSpecialization(@Body() payload: CreateSpecializationDto, @Req() req: Request) {
        const { role_id } = req["user"] as JwtPayload
        if (role_id !== this.roleService.getRoleId(RoleName.ADMIN)) throw new ForbiddenException('You don\'t have enough permission')
        return this.specializationService.create(payload)
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    deleteSpecialization(@Param('id') id: string, @Req() req: Request) {
        const { role_id } = req["user"] as JwtPayload
        if (role_id !== this.roleService.getRoleId(RoleName.ADMIN)) throw new ForbiddenException('You don\'t have enough permission')
        return this.specializationService.delete(id)
    }
}
