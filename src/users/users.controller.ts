import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { user_role_type } from 'generated/prisma/enums';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/createUserDto';
import { UpdateUserDto } from './dtos/updateUserDto';

@UseGuards(AuthGuard, RolesGuard)
@Roles(user_role_type.admin)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('')
    getUsers() {
        return this.usersService.findAll()
    }

    @Post('')
    createUser(@Body() payload: CreateUserDto) {
        return this.usersService.create(payload)
    }

    @Patch(':id')
    updateUser(@Body() payload: UpdateUserDto, @Param('id') id: string){
        return this.usersService.update(payload, id)
    }
    
    @Delete(':id')
    deleteUser(@Param('id') id: string){
        return this.usersService.delete(id)
    }
}
