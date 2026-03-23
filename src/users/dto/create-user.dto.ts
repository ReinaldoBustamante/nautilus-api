import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { role_type, status_type } from "prisma/generated/enums";

export class CreateUserDto {
    @ApiProperty({ example: 'newUser@example.com' })
    @IsEmail({}, { message: 'El formato del email es incorrecto' })
    email: string;

    @ApiProperty({ example: 'test123' })
    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;

    @ApiPropertyOptional({
        enum: role_type,
        example: role_type.PATIENT,
    })
    @IsOptional()
    @IsEnum(role_type, { message: 'El rol proporcionado no es válido' })
    role: role_type;

    @ApiPropertyOptional({
        enum: status_type,
        example: status_type.ACTIVE,
    })
    @IsOptional()
    @IsEnum(status_type, { message: 'El estado proporcionado no es válido' })
    status: status_type;
}