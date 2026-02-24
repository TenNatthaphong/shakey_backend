import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BranchService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllBranch() {
    return this.prisma.branch.findMany({
      select: {
        detail: true,
      }
    });
  }
}
