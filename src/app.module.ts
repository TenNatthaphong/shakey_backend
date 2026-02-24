import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MenuModule } from './menu/menu.module';
import { BannerModule } from './banner/banner.module';
import { BranchModule } from './branch/branch.module';
import { AddressModule } from './address/address.module';

@Module({
  imports: [UserModule, AuthModule, PrismaModule, MenuModule, BannerModule, BranchModule, AddressModule],
})
export class AppModule {}
