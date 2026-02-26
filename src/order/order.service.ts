import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create_order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) { }

  async createOrder(createOrder: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        user_id: createOrder.user_id,
        delivery: createOrder.delivery,
        total_price: createOrder.total_price,
        order_details: {
          create: createOrder.order_details.map(detail => {
            const { topping_ids, ...data } = detail;
            return {
              ...data,
              order_detail_toppings: {
                create: topping_ids.map(id => ({
                  topping_id: id
                }))
              }
            };
          })
        }
      }
    });
  }

  async getOrder(user_id: string) {
    return this.prisma.order.findMany({
      where: { user_id }
    });
  }

  async deleteOrder(order_id: string) {
    return this.prisma.order.delete({
      where: { order_id }
    });
  }
}
