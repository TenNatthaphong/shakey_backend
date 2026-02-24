import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMemberDto } from './dto/create_member.dto';

import { Member_level } from '@prisma/client';

@Injectable()
export class MemberService {
  constructor(private readonly Prisma: PrismaService) {}

  async getMember() {
    return this.Prisma.member.findMany();
  }

  async createMember(createMemberDto: CreateMemberDto) {
    const startDate = new Date();
    const expDate = new Date();
    expDate.setFullYear(startDate.getFullYear() + 1);

    return this.Prisma.member.create({
      data: {
        ...createMemberDto,
        start_date: startDate,
        exp_date: expDate,
      },
    });
  }

  async updateMember(userId: string) {
    const user = await this.Prisma.user.findUnique({
      where: { user_id: userId },
      include: { member: true },
    });

    if (!user || !user.member) {
      throw new Error('Member not found for this user');
    }

    const totalCups = user.total_cups_purchased || 0;
    let newLevel: Member_level = user.member.level;

    if (totalCups >= 50) {
      newLevel = Member_level.Gold;
    } else if (totalCups >= 20) {
      newLevel = Member_level.Silver;
    }

    const updateData: any = {};

    if (newLevel !== user.member.level) {
      const startDate = new Date();
      const expDate = new Date();
      expDate.setFullYear(startDate.getFullYear() + 1);

      updateData.level = newLevel;
      updateData.start_date = startDate;
      updateData.exp_date = expDate;
    }

    return this.Prisma.member.update({
      where: { user_id: userId },
      data: updateData,
    });
  }
}
