import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDetailDto } from './dto/create_order_detail.dto';

@Injectable()
export class OrderDetailService {
    constructor(private prisma: PrismaService) { }

    async createOrderDetail(dto: CreateOrderDetailDto) {
        const { topping_ids, ...data } = dto;

        return this.prisma.orderDetail.create({
            data: {
                ...data,
                order_detail_toppings: {
                    create: topping_ids.map(id => ({
                        topping_id: id
                    }))
                }
            },
            include: {
                order_detail_toppings: true,
                variant: true
            }
        });
    }

}
