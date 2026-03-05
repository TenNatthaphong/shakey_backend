import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('menu')
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
  ) { }

  @UseGuards(AuthGuard)
  @Get()
  async findAllMenu(@Req() req) {
    return this.menuService.findAllMenu(req.user.sub);
  }

  @Get(':menu_id/variants')
  async findMenuVariant(@Param('menu_id') menu_id: string) {
    return this.menuService.findMenuVariant(menu_id);
  }

  @UseGuards(AuthGuard)
  @Get('favorite')
  async findFavoriteMenus(@Req() req) {
    return this.menuService.findFavoriteMenus(req.user.sub);
  }

}
