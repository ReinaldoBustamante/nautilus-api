import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/LoginUser.dto';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('/register')
    async createUser(@Body() payload: CreateUserDto){
        return this.authService.create(payload)
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async loginUser(@Body() payload: LoginUserDto){
        return this.authService.login(payload)
    }
}
