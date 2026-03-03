import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create_address.dto';
import { UpdateAddressDto } from './dto/update_address.dto';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) { }

  async findAllAddress(userId: string) {
    return this.prisma.address.findMany({
      where: { user_id: userId },
      select: {
        address_id: true,
        name: true,
        detail: true,
      },
    });
  }

  async addAddress(userId: string, createAddressDto: CreateAddressDto) {
    return this.prisma.address.create({
      data: { user_id: userId, ...createAddressDto },
    });
  }

  async updateAddress(updateAddressDto: UpdateAddressDto) {
    return this.prisma.address.update({
      where: { address_id: updateAddressDto.address_id },
      data: updateAddressDto,
    });
  }

  async deleteAddress(addressId: string) {
    return this.prisma.address.delete({
      where: { address_id: addressId },
    });
  }
}
