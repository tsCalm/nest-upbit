import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candle } from 'src/typeorm';
import { CandlesController } from './controllers/candles/candles.controller';
import { CandlesService } from './services/candles/candles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Candle])],
  controllers: [CandlesController],
  providers: [CandlesService],
  exports: [CandlesService],
})
export class CandlesModule {}
