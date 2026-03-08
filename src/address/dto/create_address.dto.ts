import { IsString } from "class-validator";

export class CreateAddressDto {
    @IsString()
    name: string;

    @IsString()
    detail: string;
}