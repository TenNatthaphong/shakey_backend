import { Controller, Post, Body, Get } from '@nestjs/common';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  async createMenu(
    @Body() body: { flavor?: string; size?: string; price: number; image?: string }
  ) {
    return this.menuService.createMenu(body);
  }

  @Get()
  async getMenus() {
    return this.menuService.findAll();
  }
}
