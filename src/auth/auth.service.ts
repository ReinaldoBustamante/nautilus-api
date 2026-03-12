import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JWTAdapter } from 'src/common/adapters/jwt.adapter';
import { LoginResponse } from './responses/login.response';
import { PrismaService } from 'src/prisma.service';
import { BcryptAdapter } from 'src/common/adapters/bcrypt.adapter';
import { Response, Request } from 'express'
import type { RedisClientType } from 'redis';
import { RefreshResponse } from './responses/refresh.response';
import { ProfileResponse } from './responses/profile.response';


type userPayload = {
  id: string,
  email: string,
  role: string,
  status: string,
  created_at: Date,
  updated_at: Date
}

@Injectable()
export class AuthService {
  constructor(
    @Inject('REDIS_CLIENT') private redis: RedisClientType,
    private readonly jwtAdapter: JWTAdapter,
    private readonly prismaService: PrismaService,
    private readonly bcryptAdapter: BcryptAdapter,
  ) { }

  async login(loginDto: LoginDto, res: Response): Promise<LoginResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { email: loginDto.email }
    })

    if (!user) throw new UnauthorizedException('Invalid Credentials')
    const { password, ...cleanUser } = user
    const isPasswordValid = await this.bcryptAdapter.verifyPassword(loginDto.password, password)
    if (!isPasswordValid) throw new UnauthorizedException('Invalid Credentials')

    const access_token = this.jwtAdapter.generateToken(cleanUser, '10m')
    const refresh_token = this.jwtAdapter.generateToken(cleanUser, '7d')

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7
    })

    try {
      await this.redis.set(`refresh_token:${user.id}`, refresh_token, { EX: 7 * 24 * 60 * 60 });
    } catch (err) {
      console.error('Error de Redis:', err)
      throw err
    }

    return {
      access_token,
      user: cleanUser
    }
  }

  async logout(req: Request, res: Response): Promise<{ message: string }> {
    const user = req['user'] as userPayload

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
    })

    try {
      await this.redis.del(`refresh_token:${user.id}`)
    } catch (err) {
      console.log('Error de Redis:', err)
      throw err
    }

    return {
      message: 'success'
    };
  }

  async refresh(req: Request, res: Response): Promise<RefreshResponse> {
    const refresh_token = req.cookies['refresh_token']
    if (!refresh_token) throw new UnauthorizedException('refresh token not found')

    const tokenDecoded = this.jwtAdapter.decodeToken(refresh_token) as userPayload

    const cleanUser: userPayload = {
      id: tokenDecoded.id,
      email: tokenDecoded.email,
      role: tokenDecoded.role,
      status: tokenDecoded.status,
      created_at: tokenDecoded.created_at,
      updated_at: tokenDecoded.updated_at
    }

    const redis_refresh_token = await this.redis.get(`refresh_token:${cleanUser.id}`)
    if (!redis_refresh_token) throw new NotFoundException('refresh token not found')
    if (refresh_token !== redis_refresh_token) throw new UnauthorizedException('Invalid session')

    const access_token = this.jwtAdapter.generateToken(cleanUser, '10m')
    const new_refresh_token = this.jwtAdapter.generateToken(cleanUser, '7d')

    res.cookie('refresh_token', new_refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7
    })

    try {
      await this.redis.set(`refresh_token:${cleanUser.id}`, new_refresh_token)
    } catch (err) {
      console.log('Error de Redis:', err)
      throw err
    }

    return {
      access_token
    }
  }

  async profile(req: Request): Promise<ProfileResponse> {
    const user = req['user'] as userPayload
    const profile = await this.prismaService.doctor.findUnique({
      where: {
        user_id: user.id
      }
    })
    if (!profile) throw new NotFoundException('Profile not exists')
    return {
      id: profile.id,
      email: user.email,
      name: profile.name,
      phone_number: profile.phone_number,
      rut: profile.rut
    }
  }


}
