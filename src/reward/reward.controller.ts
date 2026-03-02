import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { RewardService } from './reward.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) { }

  @Get()
  async getAllReward() {
    return this.rewardService.findAllReward();
  }

  @UseGuards(AuthGuard)
  @Get('my_rewards')
  async getUserReward(@Req() req) {
    return this.rewardService.findUserRewards(req.user.sub);
  }

}