import { Controller, Get, Post, UseGuards, Req, Body} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AddressService } from 'src/address/address.service';
import { UpdateAddressDto } from 'src/address/dto/update_address.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly addressService: AddressService
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

  //Reward part
  @UseGuards(AuthGuard)
  @Post('redeem_reward')
  redeemReward(@Req() req, @Body() body) {
    return this.userService.redeemReward(req.user.sub, body.reward_id);
  }

  @UseGuards(AuthGuard)
  @Post('use_reward')
  useReward(@Body() body) {
    return this.userService.useReward(body.user_reward_id);
  }

  //Favorite part
  @UseGuards(AuthGuard)
  @Post('add_favorite')
  addFavorite(@Req() req, @Body() body) {
    return this.userService.addFavorite(req.user.sub, body.menu_id);
  }

  @UseGuards(AuthGuard)
  @Post('remove_favorite')
  removeFavorite(@Req() req, @Body() body) {
    return this.userService.removeFavorite(req.user.sub, body.menu_id);
  }

  //Address part
  @UseGuards(AuthGuard)
  @Get('address')
  getAddress(@Req() req) {
    return this.addressService.findAllAddress(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('add_address')
  addAddress(@Req() req, @Body() body) {
    return this.addressService.addAddress(req.user.sub, body);
  }

  @UseGuards(AuthGuard)
  @Post('delete_address')
  deleteAddress(@Body() body) {
    return this.addressService.deleteAddress(body.address_id);
  }

  @UseGuards(AuthGuard)
  @Post('update_address')
  updateAddress(@Body() dto : UpdateAddressDto) {
    return this.addressService.updateAddress(dto);
  }
}
