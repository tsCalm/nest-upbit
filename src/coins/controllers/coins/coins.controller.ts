import { Controller, Get, Param, ParseEnumPipe, Post } from '@nestjs/common';
import { CoinsService } from 'src/coins/services/coins/coins.service';
import { MARKETS } from '../../../enum';

@Controller('coins')
export class CoinsController {
  constructor(private readonly coinService: CoinsService) {}

  @Get('')
  getCoins() {
    return this.coinService.findAll();
  }

  @Get('attention')
  getAttentionCoins() {
    return this.coinService.findAllAttentionCoin();
  }

  @Post('attention/:market')
  saveAttentionCoin(
    @Param('market', new ParseEnumPipe(MARKETS)) market: string,
  ) {
    return this.coinService.saveAttentionCoin(market);
  }
}
