import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({example: 'user@user.cl'})
    @IsEmail({}, { message: 'Email inválido' })
    email: string;

    @ApiProperty({example: '123456'})
    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;
}