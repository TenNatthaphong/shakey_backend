import { Controller, Get } from '@nestjs/common';
import { ToppingService } from './topping.service';

@Controller('topping')
export class ToppingController {
  constructor(private readonly toppingService: ToppingService) {}

  @Get()
  findAll() {
    return this.toppingService.findAllToppings();
  }
}
