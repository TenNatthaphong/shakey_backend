import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create_address.dto';
import { UpdateAddressDto } from './dto/update_address.dto';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllAddress() {
    return this.prisma.address.findMany({
      select : {
        address_id : true,
        name : true,
        detail : true,
      } 
    });
  }

  async createAddress(createAddressDto: CreateAddressDto) {
    return this.prisma.address.create({
      data: createAddressDto,
    });
  }

  async updateAddress(updateAddressDto: UpdateAddressDto) {
    return this.prisma.address.update({
      where: { address_id: updateAddressDto.address_id },
      data: updateAddressDto,
    });
  }

  async deleteAddress(address_id: string) {
    return this.prisma.address.delete({
      where: { address_id : address_id},
    });
  }
}
