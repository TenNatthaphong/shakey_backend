import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Member_level, RewardStatus } from '@prisma/client';
import { EditProfileDto } from './dto/update_profile.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async findById(userId: string) {
    return this.prisma.user.findUnique({
      where: { user_id: userId },
      include: {
        favorites: true,
        orders: {
          orderBy: { created_at: 'desc' },
          take: 5,
        },
        user_rewards: {
          include: { reward: true },
        },
      },
    });
  }

  async editProfile(userId: string, body: EditProfileDto) {
    if (body.birthday) {
      body.birthday = new Date(body.birthday);
    }
    try {
      return await this.prisma.user.update({
        where: { user_id: userId },
        data: body,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        const target = error.meta?.target;
        if (target && target.includes('username')) {
          throw new BadRequestException('Username is already taken');
        }
        if (target && target.includes('email')) {
          throw new BadRequestException('Email is already taken');
        }
      }
      throw error;
    }
  }

  async updateMember(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    let newLevel = user.member;
    if (user.total_cups_purchased >= 150) {
      newLevel = Member_level.Gold;
    } else if (user.total_cups_purchased >= 50) {
      newLevel = Member_level.Silver;
    }

    if (newLevel !== user.member) {
      return this.prisma.user.update({
        where: { user_id: userId },
        data: { member: newLevel },
      });
    }

    return user;
  }

  //update purchased cups
  async addPurchasedCups(userId: string, cups: number) {
    await this.prisma.user.update({
      where: { user_id: userId },
      data: { total_cups_purchased: { increment: cups } },
    });
    return this.updateMember(userId);
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
}