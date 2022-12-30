import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CandlesModule } from './candles/candles.module';
import { ScheduleModule } from '@nestjs/schedule';
import entities from './typeorm';
import { CoinScheduler } from './scheduler/coin-scheduler';
import { GlobalConfigModule } from './config';
import { StrategyOrderModule } from './strategy-order/strategy-order.module';
import { Queue } from './queue';
import { TaskJob } from './queue/job';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AttentionListener } from './listener/attention.listener';
import { CandlesService } from './candles/services/candles/candles.service';
import { MarketsModule } from './markets/coins.module';
import { UpbitApi } from './common/upbit-api';
import { TASK_JOB, ATTENTION_MARKET } from './const';
import { TaskJobWrapper } from './queue/job-wrapper';

@Module({
  imports: [
    GlobalConfigModule,
    CandlesModule,
    MarketsModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    StrategyOrderModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CoinScheduler,
    UpbitApi,
    {
      provide: ATTENTION_MARKET,
      useClass: Queue,
    },
    {
      provide: TASK_JOB,
      useClass: Queue,
    },
    TaskJobWrapper,
    TaskJob,
    AttentionListener,
  ],
})
export class AppModule {}
