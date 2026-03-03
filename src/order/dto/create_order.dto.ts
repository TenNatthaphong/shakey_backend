import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateOrderDetailDto } from "src/order_detail/dto/create_order_detail.dto";
import { Type } from "class-transformer";

export class CreateOrderDto {
    @IsString()
    @IsOptional()
    user_id?: string;

    @IsBoolean()
    delivery: boolean;

    @IsNumber()
    total_price: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderDetailDto)
    order_details: CreateOrderDetailDto[];
}