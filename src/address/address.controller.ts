import { Controller, Get , Post , Patch , Delete ,Body , Param} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create_address.dto';
import { UpdateAddressDto } from './dto/update_address.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  async getAddress() {
    const address = await this.addressService.findAllAddress();
    return address;
  }

  @Post()
  async createAddress(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.createAddress(createAddressDto);
  }

  @Patch()
  async updateAddress(@Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.updateAddress(updateAddressDto);
  }

  @Delete(':address_id')
  async deleteAddress(@Param('address_id') address_id: string) {
    return this.addressService.deleteAddress(address_id);
  }
}
