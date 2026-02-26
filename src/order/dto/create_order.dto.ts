import { CreateOrderDetailDto } from "src/order_detail/dto/create_order_detail.dto";

export class CreateOrderDto {
    user_id: string;
    delivery: boolean;
    total_price: number;
    order_details: CreateOrderDetailDto[];
}