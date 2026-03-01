import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { RewardService } from './reward.service';

@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) { }

  @Get()
  async getAllReward() {
    return this.rewardService.findAllReward();
  }

  @Get('my')
  async getMyRewards(@Query('userId') userId: string) {
    return this.rewardService.findUserRewards(userId);
  }

  @Post('redeem')
  async redeem(@Body() body: { userId: string; rewardId: string }) {
    return this.rewardService.redeemReward(body.userId, body.rewardId);
  }

  @Patch('use/:id')
  async use(@Param('id') id: string, @Body('userId') userId: string) {
    return this.rewardService.useReward(userId, id);
  }
}
