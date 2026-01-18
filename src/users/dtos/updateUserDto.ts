import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator"
import { user_role_type, user_status_type } from "generated/prisma/enums"

export class UpdateUserDto {
    @IsOptional()
    @IsEmail()
    email: string
    
    @IsOptional()
    @IsEnum(user_role_type, {message: 'role must be a valid user_role_type'})
    user_role: user_role_type

    @IsOptional()
    @IsEnum(user_status_type, {message: 'status must be a valid user_status_type'})
    user_status: user_status_type
}