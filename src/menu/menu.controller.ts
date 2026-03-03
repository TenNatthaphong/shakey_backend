import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('menu')
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly jwtService: JwtService,
  ) { }

  @Get()
  async getMenus(@Req() req) {
    // Try to extract user from token if available, but don't require it
    let userId: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });
        userId = payload.sub;
      } catch (e) {
        // Token invalid, treat as guest
      }
    }
    return this.menuService.findAllMenu(userId);
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
