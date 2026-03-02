import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllMenu() {
    return this.prisma.menu.findMany({
      select: {
        menu_id: true,
        image: true,
        flavor: true,
        base_price: true,
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
        base_price: true,
        discount: true,
        rating: true,
      },
    });
  }

  async findMenuVariant(menuId: string) {
    return this.prisma.menuVariant.findMany({
      where: {
        menu_id: menuId,
      },
      select: {
        variant_id: true,
        size: true,
        price_upsize: true,
      },
    });
  }

  async addFavorite(userId: string, menuId: string) {
      return this.prisma.favorite.create({
        data: {
          user_id: userId,
          menu_id: menuId
        }
      });
    }
  
    async removeFavorite(userId: string, menuId: string) {
      return this.prisma.favorite.delete({
        where: {
          user_id_menu_id: {
            user_id: userId,
            menu_id: menuId
          }
        }
      });
    }
}
