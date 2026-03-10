import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { role_type, status_type } from "prisma/generated/enums";

export class CreateUserDto {
    @IsEmail({}, { message: 'El formato del email es incorrecto' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;

    @IsOptional()
    @IsEnum(role_type, { message: 'El rol proporcionado no es válido' })
    role: role_type;
    
    @IsOptional()
    @IsEnum(status_type, { message: 'El estado proporcionado no es válido' })
    status: status_type;
}