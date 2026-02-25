import { Controller, Get , Post , Patch , Delete ,Body , Param} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create_address.dto';
import { UpdateAddressDto } from './dto/update_address.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get(':user_id')
  async getAddress(@Param('user_id') user_id: string) {
    const address = await this.addressService.findAllAddress(user_id);
    return address;
  }

  @Post(':user_id')
  async createAddress(@Param('user_id') user_id: string, @Body() createAddressDto: CreateAddressDto,) {
    return this.addressService.createAddress(user_id, createAddressDto);
  }

  @Patch(':address_id')
  async updateAddress(@Param('address_id') address_id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.updateAddress(address_id, updateAddressDto);
  }

  @Delete(':address_id')
  async deleteAddress(@Param('address_id') address_id: string) {
    return this.addressService.deleteAddress(address_id);
  }
}
