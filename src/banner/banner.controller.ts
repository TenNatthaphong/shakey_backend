import { Controller, Get } from '@nestjs/common';
import { BannerService } from './banner.service';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  async getBanners() {
    const banners = await this.bannerService.findAllBanner();
    return banners.map((banner) => banner.image);
  }
}
