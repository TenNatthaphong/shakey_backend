import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create_order.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @UseGuards(AuthGuard)
  @Post()
  async createOrder(@Body() createOrder: CreateOrderDto, @Req() req: any) {
    return this.orderService.createOrder(createOrder, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('history')
  async getOrderHistory(@Req() req: any) {
    return this.orderService.getOrderHistory(req.user.sub);
  }

  @Delete(':order_id')
  async deleteOrder(@Param('order_id') order_id: string) {
    return this.orderService.deleteOrder(order_id);
  }

  @Get(':user_id')
  async getOrder(@Param('user_id') user_id: string) {
    return this.orderService.getOrder(user_id);
  }
}
