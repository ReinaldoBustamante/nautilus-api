import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/LoginUser.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';



@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('/register')
    async createUser(@Body() payload: CreateUserDto){
        return this.authService.create(payload)
    }

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async loginUser(@Body() payload: LoginUserDto){
        return this.authService.login(payload)
    }

    @Get('/check-status')
    @UseGuards(AuthGuard)
    async tokenIsValid(@Request() req: Request){
        return this.authService.verify(req)
    }
}
