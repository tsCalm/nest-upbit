import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OneMinuteCandle } from 'src/typeorm';
import { CandlesController } from './controllers/candles/candles.controller';
import { CandlesService } from './services/candles/candles.service';

@Module({
  imports: [TypeOrmModule.forFeature([OneMinuteCandle])],
  controllers: [CandlesController],
  providers: [CandlesService],
})
export class CandlesModule {}
