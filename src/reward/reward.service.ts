import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RewardService {
  constructor(private readonly prisma: PrismaService) { }

  async findAllReward() {
    return this.prisma.reward.findMany();
  }

  async findUserRewards(userId: string) {
    return this.prisma.userReward.findMany({
      where: {
        user_id: userId,
        reward_status: 'ACTIVE',
      },
      include: {
        reward: true,
      },
    });
  }

  async redeemReward(userId: string, rewardId: string) {
    const reward = await this.prisma.reward.findUnique({
      where: { reward_id: rewardId },
    });

    if (!reward) {
      throw new NotFoundException('Reward not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.point < reward.require_point) {
      throw new BadRequestException('Not enough points');
    }

    // Use a transaction to ensure atomic update
    return this.prisma.$transaction(async (tx) => {
      // Deduct points
      await tx.user.update({
        where: { user_id: userId },
        data: {
          point: {
            decrement: reward.require_point,
          },
        },
      });

      // Create UserReward
      return tx.userReward.create({
        data: {
          user_id: userId,
          reward_id: rewardId,
          reward_status: 'ACTIVE',
        },
      });
    });
  }

  async useReward(userId: string, userRewardId: string) {
    const userReward = await this.prisma.userReward.findUnique({
      where: { id: userRewardId },
    });

    if (!userReward) {
      throw new NotFoundException('User reward not found');
    }

    if (userReward.user_id !== userId) {
      throw new BadRequestException('Reward does not belong to user');
    }

    if (userReward.reward_status !== 'ACTIVE') {
      throw new BadRequestException('Reward is not active');
    }

    return this.prisma.userReward.update({
      where: { id: userRewardId },
      data: {
        reward_status: 'USED',
        used_at: new Date(),
      },
    });
  }
}
