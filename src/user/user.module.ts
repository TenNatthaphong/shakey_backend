import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddressService } from 'src/address/address.service';
import { RewardModule } from 'src/reward/reward.module';
import { AddressModule } from 'src/address/address.module';
import { MenuModule } from 'src/menu/menu.module';

@Module({
  imports: [RewardModule, AddressModule, MenuModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
