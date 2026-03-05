import { IsArray, IsBoolean, IsNumber, ValidateNested } from "class-validator";
import { CreateOrderDetailDto } from "src/order_detail/dto/create_order_detail.dto";
import { Type } from "class-transformer";

export class CreateOrderDto {

    @IsBoolean()
    delivery: boolean;

    @IsNumber()
    total_price: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderDetailDto)
    order_details: CreateOrderDetailDto[];
}