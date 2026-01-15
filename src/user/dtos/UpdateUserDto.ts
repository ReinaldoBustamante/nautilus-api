import { IsEmail, IsEnum, IsOptional } from "class-validator"
import { status, status_user } from "generated/prisma/enums"
import { Role } from "src/roles.enum"

export class UpdateUserDto {
    @IsOptional()
    @IsEmail()
    email: string

    @IsOptional()
    @IsEnum(Role, { message: 'Rol inválido' })
    role: Role

    @IsOptional()
    @IsEnum(status_user)
    status: status_user
}