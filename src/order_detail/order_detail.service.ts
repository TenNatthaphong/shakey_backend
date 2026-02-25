import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderDetailService {
    constructor(private prisma: PrismaService) { }

    async createOrderDetail(orderDetail: any) {
        return this.prisma.orderDetail.create({
            data: orderDetail
        });
    }
}
