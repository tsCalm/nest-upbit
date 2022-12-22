import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CandlesService } from 'src/candles/services/candles/candles.service';

@Controller('candles')
export class CandlesController {
  constructor(private candlesService: CandlesService) {}

  @Get(':time/:unit')
  getCandleInfo(
    @Param('time') time: string,
    @Param('unit', ParseIntPipe) unit: number,
  ) {
    return this.candlesService.getCandleInfo(time, unit);
  }
}
