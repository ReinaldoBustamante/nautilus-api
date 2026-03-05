import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { status_type } from 'prisma/generated/enums';
import { JWTAdapter } from 'src/common/adapters/jwt.adapter';
import { PrismaService } from 'src/prisma.service';

type userPayload = {
    id: string,
    email: string,
    role: string,
    status: string,
    created_at: Date,
    updated_at: Date
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtAdapter: JWTAdapter
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest() as Request
        if (!request.headers['authorization']) throw new UnauthorizedException('need access token')
        const [method, token] = request.headers['authorization'].split(" ")
        if (method !== "Bearer") throw new BadRequestException('Expect Bearer method')

        try {
            const decodedToken = this.jwtAdapter.decodeToken(token) as userPayload
            const cleanUser: userPayload = {
                id: decodedToken.id,
                email: decodedToken.email,
                role: decodedToken.role,
                status: decodedToken.status,
                created_at: decodedToken.created_at,
                updated_at: decodedToken.updated_at
            }

            const user = await this.prisma.user.findUnique({
                where: { id: cleanUser.id },
                select: { id: true, status: true }
            })
            if (!user) throw new UnauthorizedException('invalid credentials')
            if (user.status !== status_type.ACTIVE) throw new UnauthorizedException('invalid credentials')

            request["user"] = cleanUser
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token has expired');
            }
            throw error
        }

        return true;
    }
}