import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BannerService {
  constructor(private readonly  prisma: PrismaService) {}

  async findAllBanner() {
    return this.prisma.banner.findMany({
      select: {
        image: true,
      },
    });
  }
}
