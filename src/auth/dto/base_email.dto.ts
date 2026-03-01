import { IsNotEmpty } from "class-validator";
import { Transform } from "class-transformer";

export class BaseEmailDto {
    @Transform(({ value }) => value.toLowerCase())
    @IsNotEmpty()
    email: string;
}