import { Controller, Get, Query } from '@nestjs/common';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getMenus() {
    return this.menuService.findAllMenu();
  }

  @Get('favorite')
  async getFavoriteMenus(@Query('userId') userId: string) {
    return this.menuService.findFavoriteMenus(userId);
  }
}
