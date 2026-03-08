import { IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateAddressDto {
    @IsUUID()
    address_id: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    detail?: string;
}