import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { JWTAdapter } from 'src/common/adapters/jwt.adapter';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request
    if (!request.headers['authorization']) throw new UnauthorizedException('need access token')
    const [method, token] = request.headers['authorization'].split(" ")
    if (method !== "Bearer") throw new BadRequestException('Expect Bearer method')
    const decodedToken = await JWTAdapter.verifyToken(token) as JwtPayload

    request["user"] = {
      sub: decodedToken.sub,
      role_id: decodedToken.role_id,
    };


    return true;
  }
}
