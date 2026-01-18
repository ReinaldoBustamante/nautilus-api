import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dtos/createUserDto';
import { UpdateUserDto } from './dtos/updateUserDto';
import { BcryptAdapter } from 'src/auth/adapters/bcrypt.adapter';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService, private bcryptAdapter: BcryptAdapter){}

    async findAll(){
        return await this.prisma.user.findMany({
            select: {id: true, email: true, user_role: true, user_status: true, created_at: true, updated_at: true, deleted_at: true}
        });
    }

    async create(payload: CreateUserDto){
        try {
            return await this.prisma.user.create({ 
                data: {...payload, password: await this.bcryptAdapter.encryptPassword(payload.password)},
                select: {id: true, email: true, user_role: true, user_status: true, created_at: true, updated_at: true, deleted_at: true}
            })
        } catch (err) {
            if (err.code === 'P2002') throw new ConflictException('user already exist')
        }
    }

    async update(payload: UpdateUserDto, id: string){
        return await this.prisma.user.update({
            data: payload,
            where: { id }
        })
    }

    async delete(id: string){
        return await this.prisma.user.update({
            data: { deleted_at: new Date() },
            where: { id }
        })
    }
}
