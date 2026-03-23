import { Controller, Get, Post, Body, Res, UseGuards, Req, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Response, Request } from 'express'
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { role_type } from 'prisma/generated/enums';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ description: 'Autentica a un usuario mediante email y contraseña. Si las credenciales son válidas, devuelve la información del usuario junto con un access token en la respuesta y establece un refresh token en una cookie httpOnly para mantener la sesión.' })
  @Post('login')
  login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(loginDto, res);
  }

  @ApiOperation({ description: 'Genera un nuevo access token utilizando el refresh token almacenado en una cookie httpOnly. Este endpoint permite mantener la sesión sin necesidad de volver a iniciar sesión.'})
  @Post('refresh')
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.refresh(req, res);
  }

  @ApiOperation({ description: 'Cierra la sesión del usuario eliminando el refresh token almacenado. Después de esta operación, el usuario deberá autenticarse nuevamente para obtener nuevos tokens.' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post('logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req, res);
  }

  @ApiOperation({ description: '**Requiere rol DOCTOR.**\n\nRetorna la información del usuario autenticado basada en el JWT enviado en el header Authorization.'})
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('profile')
  @Roles(role_type.DOCTOR)
  getProfile(@Req() req: Request) {
    return this.authService.profile(req);
  }
}
