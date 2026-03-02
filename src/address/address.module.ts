import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers : [AddressService, PrismaService],
  exports: [AddressService],
})
export class AddressModule {}
