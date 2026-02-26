import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create_order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  async createOrder(@Body() createOrder: CreateOrderDto) {
    return this.orderService.createOrder(createOrder);
  }

  @Get(':user_id')
  async getOrder(@Param('user_id') user_id: string) {
    return this.orderService.getOrder(user_id);
  }

  @Delete(':order_id')
  async deleteOrder(@Param('order_id') order_id: string) {
    return this.orderService.deleteOrder(order_id);
  }
}
