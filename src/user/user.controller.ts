import { Controller, Get, Post, UseGuards, Req, Body} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AddressService } from 'src/address/address.service';
import { RewardService } from 'src/reward/reward.service';
import { UpdateAddressDto } from 'src/address/dto/update_address.dto';
import { MenuService } from 'src/menu/menu.service';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly addressService: AddressService,
    private readonly rewardService: RewardService,
    private readonly menuService: MenuService
  ) {}

  //Profile part
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return this.userService.findById(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('edit_profile')
  editProfile(@Req() req, @Body() body) {
    return this.userService.editProfile(req.user.sub, body);
  }

  @UseGuards(AuthGuard)
  @Post('update_point')
  updatePoint(@Req() req, @Body() body) {
    return this.userService.updatePoint(req.user.sub, body.point);
  }

  //Reward part
  @UseGuards(AuthGuard)
  @Get('my_rewards')
  getMyRewards(@Req() req) {
    return this.rewardService.findUserRewards(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('reward/redeem')
  redeemReward(@Req() req, @Body() body) {
    return this.rewardService.redeemReward(req.user.sub, body.reward_id);
  }

  @UseGuards(AuthGuard)
  @Post('reward/use')
  useReward(@Req() req, @Body() body) {
    return this.rewardService.useReward(req.user.sub, body.user_reward_id);
  }

  //Favorite part
  @UseGuards(AuthGuard)
  @Post('favorite/add')
  addFavorite(@Req() req, @Body() body) {
    return this.menuService.addFavorite(req.user.sub, body.menu_id);
  }

  @UseGuards(AuthGuard)
  @Post('favorite/remove')
  removeFavorite(@Req() req, @Body() body) {
    return this.menuService.removeFavorite(req.user.sub, body.menu_id);
  }

  //Address part
  @UseGuards(AuthGuard)
  @Get('address')
  getAddress(@Req() req) {
    return this.addressService.findAllAddress(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('address/add')
  addAddress(@Req() req, @Body() body) {
    return this.addressService.addAddress(req.user.sub, body);
  }

  @UseGuards(AuthGuard)
  @Post('address/delete')
  deleteAddress(@Body() body) {
    return this.addressService.deleteAddress(body.address_id);
  }

  @UseGuards(AuthGuard)
  @Post('address/update')
  updateAddress(@Body() dto : UpdateAddressDto) {
    return this.addressService.updateAddress(dto);
  }
}
