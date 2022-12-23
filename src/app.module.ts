import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CandlesModule } from './candles/candles.module';
import { CoinsModule } from './coins/coins.module';
import { CoinsController } from './conins/controllers/coins/coins.controller';
import { ScheduleModule } from '@nestjs/schedule';
import entities from './typeorm';
import { CoisService } from './scheduler/coin-scheduler';
import { GlobalConfigModule } from './config';

@Module({
  imports: [
    GlobalConfigModule,
    CandlesModule,
    ScheduleModule.forRoot(),
    CoinsModule,
  ],
  controllers: [AppController, CoinsController],
  providers: [AppService, CoisService],
})
export class AppModule {}
