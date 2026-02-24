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
}
