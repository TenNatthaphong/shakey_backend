import { Controller, Get, Param } from '@nestjs/common';
import { OrderDetailService } from './order_detail.service';

@Controller('order-detail')
export class OrderDetailController {
    constructor(private readonly orderDetailService: OrderDetailService) { }

    @Get(':order_id')
    async getOrderDetail(@Param('order_id') order_id: string) {
        return this.orderDetailService.getOrderDetail(order_id);
    }
}
