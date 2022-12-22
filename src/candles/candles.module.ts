import { Module } from '@nestjs/common';
import { CandlesController } from './controllers/candles/candles.controller';
import { CandlesService } from './services/candles/candles.service';

@Module({
  controllers: [CandlesController],
  providers: [CandlesService]
})
export class CandlesModule {}
