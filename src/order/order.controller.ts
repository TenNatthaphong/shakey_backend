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

}
