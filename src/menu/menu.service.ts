import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async createMenu(data: {
    flavor?: string;
    size?: string;
    price: number;
    image?: string;
  }) {
    return this.prisma.menu.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.menu.findMany();
  }
}
