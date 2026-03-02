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
    if (body.birthday) {
      body.birthday = new Date(body.birthday);
    }
    return this.prisma.user.update({
      where: { user_id: userId },
      data: body
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
}