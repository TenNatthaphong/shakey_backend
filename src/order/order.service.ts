import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create_order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) { }

  async createOrder(createOrder: CreateOrderDto, user_id: string) {
    return this.prisma.order.create({
      data: {
        user_id: user_id,
        delivery: createOrder.delivery,
        total_price: createOrder.total_price,
        order_details: {
          create: createOrder.order_details.map(detail => {
            const { topping_ids, ...data } = detail;
            return {
              ...(data as any),
              order_detail_toppings: {
                create: topping_ids.map(id => ({
                  topping_id: id
                }))
              }
            };
          })
        }
      } as any
    });
  }

  async getOrderHistory(user_id: string) {
    return this.prisma.order.findMany({
      where: { user_id },
      orderBy: { created_at: 'desc' },
      take: 5,
      include: {
        order_details: {
          include: {
            variant: {
              include: {
                menu: true,
              },
            },
          },
        },
      },
    });
  }
}
