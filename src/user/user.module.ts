import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddressService } from 'src/address/address.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, AddressService],
})
export class UserModule {}
