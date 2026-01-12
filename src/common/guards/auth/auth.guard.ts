import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { JWTAdapter } from 'src/common/adapters/jwt.adapter';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request
    if (!request.headers['authorization']) throw new UnauthorizedException('need access token')
    const [method, token] = request.headers['authorization'].split(" ")
    if (method !== "Bearer") throw new BadRequestException('Expect Bearer method')
    const decodedToken = await JWTAdapter.verifyToken(token) as JwtPayload

    const user = await this.prisma.user.findUnique({
      where: { id: decodedToken.sub },
      select: { id: true, is_active: true, deleted_at: true }
    })
    if (!user) throw new UnauthorizedException('User don\'t exist in system')
    if (!user?.is_active) throw new UnauthorizedException('User is disabled')
    if (user.deleted_at !== null) throw new UnauthorizedException('User is deleted')
    request["user"] = {
      sub: decodedToken.sub,
      role: decodedToken.role,
    };


    return true;
  }
}
