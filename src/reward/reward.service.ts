import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RewardService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllReward() {
    return this.prisma.reward.findMany();
  }
}
