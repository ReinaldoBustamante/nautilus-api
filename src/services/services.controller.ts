import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { user_role_type } from 'generated/prisma/enums';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dtos/CreateServiceDto';
import { UpdateServiceDto } from './dtos/UpdateServiceDto';

@UseGuards(AuthGuard, RolesGuard)
@Roles(user_role_type.admin)
@Controller('services')
export class ServicesController {

    constructor(private readonly servicesService: ServicesService){}
    @Get('')
    getAllServices(){
        return this.servicesService.findAll()
    }

    @Post('')
    createService(@Body() payload: CreateServiceDto){
        return this.servicesService.create(payload)
    }

    @Patch(':id')
    updateService(@Body() payload: UpdateServiceDto, @Param('id') id: string){
        return this.servicesService.update(payload, id)
    }

    @Delete(':id')
    deleteService(@Param('id') id: string){
        return this.servicesService.delete(id)
    }
}
