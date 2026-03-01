import { IsNotEmpty, IsString } from "class-validator";
import { BaseEmailDto } from "./base_email.dto";

export class OtpDto extends BaseEmailDto{
    @IsString()
    @IsNotEmpty()
    otp: string;
}