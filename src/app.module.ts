import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MenuModule } from './menu/menu.module';
import { BannerModule } from './banner/banner.module';
import { BranchModule } from './branch/branch.module';
import { AddressModule } from './address/address.module';
import { ToppingModule } from './topping/topping.module';
import { RewardModule } from './reward/reward.module';
import { OrderDetailModule } from './order_detail/order_detail.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    AddressModule,
    AuthModule,
    BannerModule,
    BranchModule,
    MenuModule,
    OrderModule,
    OrderDetailModule,
    PrismaModule,
    RewardModule,
    ToppingModule,
    UserModule,
  ],
})
export class AppModule { }
