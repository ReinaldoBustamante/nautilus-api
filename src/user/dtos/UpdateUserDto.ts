import { IsEmail, IsEnum, IsOptional } from "class-validator"
import { Role } from "src/roles.enum"

export class UpdateUserDto {
    @IsOptional()
    @IsEmail()
    email: string

    @IsOptional()
    @IsEnum(Role, { message: 'Rol inválido' })
    role: Role
}