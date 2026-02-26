import { Sweetness } from "@prisma/client";

export class CreateOrderDetailDto {
    order_id: string;
    variant_id: string;
    quantity: number;
    sweetness: Sweetness;
    price: number; // base_price + upsize - discount
    note?: string;
    topping_ids: string[];
}