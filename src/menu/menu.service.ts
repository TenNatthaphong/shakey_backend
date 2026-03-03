import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllMenu(userId?: string) {
    const menus = await this.prisma.menu.findMany({
      select: {
        menu_id: true,
        image: true,
        flavor: true,
        base_price: true,
        discount: true,
        rating: true,
      },
    });

    if (!userId) {
      return menus.map(menu => ({ ...menu, favorite: false }));
    }

    const favorites = await this.prisma.favorite.findMany({
      where: { user_id: userId },
      select: { menu_id: true },
    });

    const favoriteIds = new Set(favorites.map(f => f.menu_id));

    return menus.map(menu => ({
      ...menu,
      favorite: favoriteIds.has(menu.menu_id),
    }));
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
    }).then(menus => menus.map(m => ({ ...m, favorite: true })));
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
      try {
        return await this.prisma.favorite.delete({
          where: {
            user_id_menu_id: {
              user_id: userId,
              menu_id: menuId
            }
          }
        });
      } catch (error) {
        if (error.code === 'P2025') {
          return null;
        }
        throw error;
      }
    }
}
