import { Controller, Post, Body } from '@nestjs/common';
import { OrderDetailService } from './order_detail.service';

@Controller('order-detail')
export class OrderDetailController {
    constructor(private readonly orderDetailService: OrderDetailService) { }

    @Post()
    async createOrderDetail(@Body() orderDetail: any) {
        return this.orderDetailService.createOrderDetail(orderDetail);
    }
}
