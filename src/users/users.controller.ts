import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { role_type } from 'prisma/generated/enums';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@UseGuards(AuthGuard, RolesGuard)
@Roles(role_type.ADMIN)
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOperation({description: '**Requiere rol ADMIN.**\n\nRegistra un nuevo usuario en el sistema utilizando los datos proporcionados en la solicitud.'})
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  
  @ApiOperation({description: '**Requiere rol ADMIN.**\n\nRetorna la lista de usuarios registrados en el sistema.'})
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ description: '**Requiere rol ADMIN.**\n\nPermite modificar el estado (`ACTIVE`, `INNACTIVE`, `SUSPENDED`). y el rol de un usuario (`ADMIN`, `DOCTOR`, `PATIENT`) de un usuario'})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

}
