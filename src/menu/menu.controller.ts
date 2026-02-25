import { Controller, Get, Param } from '@nestjs/common';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getMenus() {
    return this.menuService.findAllMenu();
  }

  @Get('favorite/:userId')
  async getFavoriteMenus(@Param('userId') userId: string) {
    return this.menuService.findFavoriteMenus(userId);
  }

  @Get(':menu_id/variants')
  async getMenuVariant(@Param('menu_id') menu_id: string) {
    return this.menuService.findMenuVariant(menu_id);
  }
}
