import { IsBoolean, IsNotEmpty } from "class-validator";

export class UpdateScheduleDto {


    @IsBoolean()
    is_activated: boolean
}