import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OrderDetailService } from './order_detail.service';
import { CreateOrderDetailDto } from './dto/create_order_detail.dto';

@Controller('order-detail')
export class OrderDetailController {
    constructor(private readonly orderDetailService: OrderDetailService) { }

    @Post()
    async createOrderDetail(@Body() createOrderDetail: CreateOrderDetailDto) {
        return this.orderDetailService.createOrderDetail(createOrderDetail);
    }

    @Get(':order_id')
    async getOrderDetail(@Param('order_id') order_id: string) {
        return this.orderDetailService.getOrderDetail(order_id);
    }
}
