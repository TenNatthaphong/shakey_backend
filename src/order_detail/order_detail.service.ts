import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderDetailService {
    constructor(private readonly prisma: PrismaService) { }

    async getOrderDetail(order_id: string) {
        return this.prisma.orderDetail.findMany({
            where: { order_id },
            include: {
                order_detail_toppings: {
                    include: {
                        topping: true
                    },
                },
                variant: {
                    include: {
                        menu: true
                    }
                }
            }
        });
    }
}
