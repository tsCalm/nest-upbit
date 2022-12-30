import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CandlesService } from 'src/candles/services/candles/candles.service';

@Controller('candles')
export class CandlesController {
  // private readonly cvCoinName = {
  //   '룸' : 'KRW-ROOM',
  //   '밀크' : 'KRW-MLK',
  //   '피르마': 'KRW-FCT2',
  //   '스택스': 'KRW-STX',
  //   '무비': 'KRW-MBL',

  // }
  constructor(private candlesService: CandlesService) {}

  // @Get(':time/:unit')
  // getCandleInfo(
  //   @Param('time') time: string,
  //   @Param('unit', ParseIntPipe) unit: number,
  // ) {
  //   return this.candlesService.getCandleInfo(time, unit);
  // }

  @Get('one')
  findOneMinutes() {
    return this.candlesService.findOneMCandle();
  }
}
