import { Controller, Get } from '@nestjs/common';
import { RewardService } from './reward.service';

@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Get()
  async getAllReward() {
    return this.rewardService.findAllReward();
  }
}
