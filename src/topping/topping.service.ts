import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ToppingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllToppings() {
    return this.prisma.topping.findMany(
      {select: {
        name: true,
        price: true,
      }}
    );
  }
  
}
