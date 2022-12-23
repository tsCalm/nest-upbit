import { Controller, Get } from '@nestjs/common';
import { CoinsService } from 'src/coins/services/coins/coins.service';

@Controller('coins')
export class CoinsController {
  constructor(private readonly coinService: CoinsService) {}

  @Get('')
  getCoins() {
    return this.coinService.findAll();
  }
}
