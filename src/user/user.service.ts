import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Member_level, RewardStatus } from '@prisma/client';
import { EditProfileDto } from './dto/update_profile.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(userId: string) {
    return this.prisma.user.findUnique({
      where: { user_id: userId },
      include: {
        favorites: true,
        orders: {
          orderBy: { created_at: 'desc' },
          take: 5
        },
        user_rewards: true,
      },
    });
  }

  async editProfile(userId: string, body: EditProfileDto) {
    return this.prisma.user.update({
      where: { user_id: userId },
      data: body
    });
  }

  async addFavorite(userId: string, menuId: string) {
    return this.prisma.favorite.create({
      data: {
        user_id: userId,
        menu_id: menuId
      }
    });
  }

  async removeFavorite(userId: string, menuId: string) {
    return this.prisma.favorite.delete({
      where: {
        user_id_menu_id: {
          user_id: userId,
          menu_id: menuId
        }
      }
    });
  }

  async updateMember(userId: string) {
    
    const user = await this.prisma.user.findUnique({
      where: { user_id: userId }
    });

    if (!user) throw new NotFoundException();

    if(user.total_cups_purchased >= 20){
      return this.prisma.user.update({
        where: { user_id: userId },
        data: {
          member: Member_level.Silver
        }
      });
    }
    else if(user.total_cups_purchased >= 50){
      return this.prisma.user.update({
        where: { user_id: userId },
        data: {
          member: Member_level.Gold
        }
      });
    }
  }

  //update member point
  async updatePoint(userId: string, point: number) {
    return this.prisma.user.update({
      where: { user_id: userId },
      data: {
        point: { increment: point }
      }
    });
  }

  //reward redeem,use
  async redeemReward(userId: string, rewardId: string) {
    const reward = await this.prisma.reward.findUnique({
      where: { reward_id: rewardId }
    });

    if (!reward) throw new NotFoundException();

    const user = await this.prisma.user.findUnique({
      where: { user_id: userId }
    });

    if (!user) throw new NotFoundException();

    if (user.point < reward.require_point)
      throw new BadRequestException('Not enough points');

    const already = await this.prisma.userReward.findFirst({
      where: {
        user_id: userId,
        reward_id: rewardId
      }
    });

    if (already)
      throw new BadRequestException('Reward already redeemed');

    return this.prisma.$transaction([
      this.prisma.user.update({
        where: { user_id: userId },
        data: {
          point: { decrement: reward.require_point }
        }
      }),

      this.prisma.userReward.create({
        data: {
          user_id: userId,
          reward_id: rewardId,
          expired_at: reward.exp_date
        }
      })
    ]);
  }

  async useReward(userRewardId: string) {
    const coupon = await this.prisma.userReward.findUnique({
      where: { id: userRewardId }
    });

    if (!coupon) throw new NotFoundException();

    if (coupon.reward_status === RewardStatus.USED)
      throw new BadRequestException('Already used');

    if (coupon.expired_at && coupon.expired_at < new Date())
      throw new BadRequestException('Expired');

    return this.prisma.userReward.update({
      where: { id: userRewardId },
      data: {
        reward_status: RewardStatus.USED,
        used_at: new Date()
      }
    });
  }
}