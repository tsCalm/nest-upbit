import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CandlesModule } from './candles/candles.module';
import { CoinsModule } from './coins/coins.module';
import { ScheduleModule } from '@nestjs/schedule';
import entities from './typeorm';
import { CoisService } from './scheduler/coin-scheduler';
import { GlobalConfigModule } from './config';
import { StrategyOrderModule } from './strategy-order/strategy-order.module';
import { jobQueue } from './queue';
import { TaskJob } from './queue/job';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AttentionListener } from './listener/attention.listener';

@Module({
  imports: [
    GlobalConfigModule,
    CandlesModule,
    CoinsModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    StrategyOrderModule,
  ],
  controllers: [AppController],
  providers: [AppService, CoisService, jobQueue, TaskJob, AttentionListener],
})
export class AppModule {}
