import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator"

export class CreateScheduleDto {

    @IsNumber()
    @Min(0)
    @Max(6)
    @IsNotEmpty()
    day_of_week: number

    @IsString()
    @IsNotEmpty()
    start_time: string

    @IsString()
    @IsNotEmpty()
    end_time: string

    @IsBoolean()
    @IsOptional()
    is_available: boolean

}
