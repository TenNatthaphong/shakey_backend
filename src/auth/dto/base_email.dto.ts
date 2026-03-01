import { IsEmail, IsNotEmpty } from "class-validator";
import { Transform } from "class-transformer";

export class BaseEmailDto {
    @Transform(({ value }) => value.toLowerCase())
    @IsNotEmpty()
    @IsEmail({}, {message: 'อีเมลไม่ถูกต้อง'})
    email: string;
}