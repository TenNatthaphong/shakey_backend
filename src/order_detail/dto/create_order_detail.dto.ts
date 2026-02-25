import { sweetness } from "@prisma/client";

export class CreateOrderDetailDto {
    menu_id: number;
    quantity: number;
    price: number;
    total_price: number;
    sweetness: sweetness;
    size: size;
    note: string;
}