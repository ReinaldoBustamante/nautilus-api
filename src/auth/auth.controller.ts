import { Controller, Get, Post, Body, Res, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Response, Request } from 'express'
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { role_type } from 'prisma/generated/enums';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(loginDto, res);
  }

  @Post('refresh')
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response){
    return this.authService.refresh(req, res);
  }
  
  @UseGuards(AuthGuard)
  @Post('logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response){
    return this.authService.logout(req, res);
  }
  
  @UseGuards(AuthGuard, RolesGuard)
  @Get('profile')
  @Roles(role_type.DOCTOR)
  getProfile(@Req() req: Request){
    return this.authService.profile(req);
  }
}
