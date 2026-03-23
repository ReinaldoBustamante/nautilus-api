import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { role_type } from 'prisma/generated/enums';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) { }

  @ApiBearerAuth('access_token')
  @ApiOperation({ description: '**Requiere rol ADMIN.** \n\nCrea un nuevo servicio en el sistema' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role_type.ADMIN)
  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @ApiOperation({ description: 'Devuelve todos los servicios médicos disponibles.' })
  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({ description: '**Requiere rol ADMIN.** \n\nPermite modificar descripcion, precio o estado del servicio.' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role_type.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

}
