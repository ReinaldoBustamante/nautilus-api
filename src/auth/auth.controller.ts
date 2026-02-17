import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/LoginUser.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import type { Request, Response } from 'express';



@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }


    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async loginUser(@Body() payload: LoginUserDto, @Res({ passthrough: true }) res: Response) {

        return this.authService.login(payload, res)
    }

    @Post('/refresh')
    async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        return this.authService.refresh(req, res)
    }

    @Post('/logout')
    @UseGuards(AuthGuard)
    async logoutUser(@Req() req: Request) {
        return this.authService.logout(req['user'].sub)
    }

    @Get('/profile')
    @UseGuards(AuthGuard)
    async tokenIsValid(@Req() req: Request) {
        return this.authService.profile(req)
    }
}
