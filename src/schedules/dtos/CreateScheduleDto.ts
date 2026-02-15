import { IsNumber, IsString, Max, Min } from "class-validator"

export class CreateScheduleDto {

    @IsNumber()
    @Min(0)
    @Max(6)
    day_of_week: string

    @IsString()
    start_time: string

    @IsString()
    end_time: string


}