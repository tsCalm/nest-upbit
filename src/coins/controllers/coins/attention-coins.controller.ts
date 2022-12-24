import { Controller, Get, Param, ParseEnumPipe, Post } from '@nestjs/common';
import { CoinsService } from 'src/coins/services/coins/coins.service';
import { markets } from '../../../enum';

@Controller('coins/attention')
export class AttentionCoinsController {
  constructor(private readonly coinService: CoinsService) {}

  @Get('')
  getAttentionCoins() {
    return this.coinService.findAllAttentionCoin();
  }

  @Post(':market')
  saveAttentionCoin(
    @Param('market', new ParseEnumPipe(markets)) market: string,
  ) {
    return this.coinService.saveAttentionCoin(market);
  }
}
