import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getMenus() {
    return this.menuService.findAllMenu();
  }

  @Get(':menu_id/variants')
  async getMenuVariant(@Param('menu_id') menu_id: string) {
    return this.menuService.findMenuVariant(menu_id);
  }

  @UseGuards(AuthGuard)
  @Get('favorite')
  async getFavoriteMenus(@Req() req) {
    return this.menuService.findFavoriteMenus(req.user.sub);
  }

}
