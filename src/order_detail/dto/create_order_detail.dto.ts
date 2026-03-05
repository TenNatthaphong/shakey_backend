import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Sweetness } from "@prisma/client";

export class CreateOrderDetailDto {
    @IsString()
    variant_id: string;

    @IsNumber()
    quantity: number;

    @IsEnum(Sweetness)
    sweetness: Sweetness;

    @IsNumber()
    price: number; // base_price + upsize - discount

    @IsString()
    @IsOptional()
    note?: string;

    @IsArray()
    @IsString({ each: true })
    topping_ids: string[];
}