import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Role } from 'src/roles.enum';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/CreateUserDto';
import { UpdateUserDto } from './dtos/UpdateUserDto';


@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService){}

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get('')
    getUsers(){
        return this.userService.findAll()
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post('')
    createUser(@Body() payload: CreateUserDto){
        return this.userService.create(payload)
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Patch(':id')
    updateUser(@Body() payload: UpdateUserDto, @Param('id') id: string){
        return this.userService.update(payload, id)
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Patch(':id/toggleStatus')
    toggleUserStatus(@Param('id') id: string){
        return this.userService.toggleStatus(id)
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Patch(':id/delete')
    deleteUser(@Param('id') id: string){
        return this.userService.delete(id)
    }
}
