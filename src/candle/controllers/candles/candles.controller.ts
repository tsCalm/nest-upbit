import {
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { CandlesService } from 'src/candle/services/candles/candles.service';
import { DAY_OF_WEEK, JOB_NAME, MARKETS } from 'src/enum';

@Controller('candles')
export class CandlesController {
  constructor(private readonly candlesService: CandlesService) {}
  // 선택 코인의 선택 요일 선택 작업 데이터만 반환
  @Get(':market/:candle_type/:day_of_week')
  getDayOfWeek(
    @Param('market', new ParseEnumPipe(MARKETS)) market: MARKETS,
    @Param('candle_type', new ParseEnumPipe(JOB_NAME)) candle_type: JOB_NAME,
    @Param('day_of_week', ParseIntPipe)
    day_of_week: number,
  ) {
    return this.candlesService.findBydayOfWeek(
      market,
      candle_type,
      day_of_week,
    );
  }
}
