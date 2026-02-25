import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create_address.dto';
import { UpdateAddressDto } from './dto/update_address.dto';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllAddress(user_id: string) {
    return this.prisma.address.findMany({
      where : { user_id : user_id},
        select : {
          address_id : true,
          name : true,
          detail : true,
        } 
      })
    };
    async createAddress(user_id: string, createAddressDto: CreateAddressDto) {
      return this.prisma.address.create({
        data: { user_id, ...createAddressDto },
      });
    }
  
    async updateAddress(address_id: string,updateAddressDto: UpdateAddressDto) {
      return this.prisma.address.update({
        where: { address_id : address_id},
        data : updateAddressDto,
      });
    }
  
    async deleteAddress(address_id: string) {
      return this.prisma.address.delete({
        where: { address_id : address_id},
      });
    }
  }
