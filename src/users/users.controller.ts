import { Controller, Get, UseGuards } from '@nestjs/common';
import { user_role_type } from 'generated/prisma/enums';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { UsersService } from './users.service';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(user_role_type.admin)
    @Get('')
    getUsers(){
        return this.usersService.findAll()
    }
    
}
