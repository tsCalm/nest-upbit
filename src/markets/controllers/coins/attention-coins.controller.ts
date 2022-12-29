import { Controller, Get, Param, ParseEnumPipe, Post } from '@nestjs/common';
import { CoinsService } from 'src/markets/services/coins/coins.service';
import { MARKETS } from '../../../enum';

@Controller('markets/attention')
export class AttentionCoinsController {
  constructor(private readonly coinService: CoinsService) {}

  @Get('')
  getAttentionCoins() {
    return this.coinService.findAllAttentionCoin();
  }

  @Post(':market')
  saveAttentionCoin(
    @Param('market', new ParseEnumPipe(MARKETS)) market: string,
  ) {
    return this.coinService.saveAttentionCoin(market);
  }
}
