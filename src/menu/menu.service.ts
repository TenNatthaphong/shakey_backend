import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async findAllMenu() {
    return this.prisma.menu.findMany({
      select: {
        menu_id: true,
        image: true,
        flavor: true,
        size: true,
        price: true,
        discount: true,
        rating: true,
      },
    });
  }

  async findFavoriteMenus(userId: string) {
    return this.prisma.menu.findMany({
      where: {
        favorites: {
          some: {
            user_id: userId,
          },
        },
      },
      select: {
        menu_id: true,
        image: true,
        flavor: true,
        size: true,
        price: true,
        rating: true,
      },
    });
  }
}
