import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ServiceService } from './service.service';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/roles.enum';
import { CreateServiceDto } from './dtos/CreateServiceDto';
import { UpdateServiceDto } from './dtos/UpdateServiceDto';


@Controller('services')
export class ServiceController {
    constructor(private readonly servicesService: ServiceService) { }


    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get('')
    findServices() {
        return this.servicesService.findAll()
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post('')
    createService(@Body() payload: CreateServiceDto) {
        return this.servicesService.create(payload)
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    deleteService(@Param('id') id: string) {
        return this.servicesService.delete(id)
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Patch(':id')
    updateService(@Body() payload: UpdateServiceDto, @Param('id') id: string){
        return this.servicesService.update(payload, id)
    }
}
