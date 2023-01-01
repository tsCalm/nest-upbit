import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import entities from './typeorm';
import { CoinScheduler } from './scheduler/coin-scheduler';
import { GlobalConfigModule } from './config';
import { Queue } from './queue';
import { TaskJob } from './queue/job';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AttentionListener } from './listener/attention.listener';
import { MarketsModule } from './markets/coins.module';
import { UpbitApi } from './common/upbit-api';
import { TASK_JOB_WRAPPER, MARKET } from './const';
import { TaskJobWrapper } from './queue/job-wrapper';
import { CandleModule } from './candle/candle.module';

@Module({
  imports: [
    GlobalConfigModule,
    MarketsModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    CandleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CoinScheduler,
    UpbitApi,
    {
      provide: MARKET,
      useClass: Queue,
    },
    {
      provide: TASK_JOB_WRAPPER,
      useClass: Queue,
    },
    TaskJobWrapper,
    TaskJob,
    AttentionListener,
  ],
})
export class AppModule {}
