import { Module } from '@nestjs/common';
import { OrderDetailService } from './order_detail.service';
import { OrderDetailController } from './order_detail.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [OrderDetailController],
  providers: [OrderDetailService, PrismaService]
})
export class OrderDetailModule {}
