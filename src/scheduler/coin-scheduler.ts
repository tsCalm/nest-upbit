import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, Interval, SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Queue } from 'src/queue';
import { JOB_NAME, MARKETS } from 'src/enum';
import { TaskJob } from 'src/queue/job';
import { jobNameToTime } from '../utils/task-job-function';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CoinsService } from 'src/markets/services/coins/coins.service';
import { UpbitApi } from 'src/common/upbit-api';
import { TASK_JOB_WRAPPER, MARKET } from '../const';
import { TaskJobWrapper } from 'src/queue/job-wrapper';
import { Market } from 'src/typeorm';
import { CandlesService } from 'src/candle/services/candles/candles.service';

@Injectable()
export class CoinScheduler implements OnModuleInit {
  constructor(
    @Inject(TASK_JOB_WRAPPER) private readonly jobQueue: Queue<TaskJobWrapper>,
    @Inject(MARKET)
    private readonly marketQueue: Queue<Market>,
    private readonly configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
    private readonly coinService: CoinsService,
    private readonly upbitApi: UpbitApi,
    private readonly taskJobService: TaskJob,
    private readonly jobWrapper: TaskJobWrapper,
    private readonly candlesService: CandlesService,
    private eventEmitter: EventEmitter2,
  ) {}
  async onModuleInit() {
    const markets = await this.upbitApi.getMarkets();
    await this.coinService.saveCoins(markets);
    this.marketQueue.setArray = await this.coinService.findAll();
  }
  /**
   * 스케줄러 작업 추가 함수
   * @param keys 수행할 작업 종류
   * @param order 작업 우선순위
   */
  addJobWrapper(keys: JOB_NAME[], order: number = 4) {
    const attentionMarkets = this.marketQueue.array.filter(
      (obj) => obj.attention,
    );

    attentionMarkets.forEach((market) => {
      const jobs = keys.map((key) =>
        this.taskJobService.instance(JOB_NAME[key], MARKETS[market.market]),
      );
      const jobWrapper = this.jobWrapper.instance(jobs, order);
      this.jobQueue.enqueue(jobWrapper);
      this.jobQueue.jobSort();
    });
  }
  // 매 시간 1분에 데이터 요청
  @Cron('0 1 * * * *')
  oneHourJobs() {
    const keys = [JOB_NAME['DAY'], JOB_NAME['HOUR_4'], JOB_NAME['HOUR_1']];
    this.addJobWrapper(keys, 3);
  }
  // // 50초마다 작업 추가
  @Interval(1000 * 3)
  microJobAdd() {
    const keys = [
      JOB_NAME['MINUTE_15'],
      JOB_NAME['MINUTE_10'],
      JOB_NAME['MINUTE_5'],
      JOB_NAME['MINUTE_3'],
      JOB_NAME['MINUTE_1'],
    ];
    this.addJobWrapper(keys, 4);
  }

  // 하루에 한번 업비트 캔들 초기화 시간에 맞춰 정보를 가져온다.
  @Cron('* * * * * *')
  async everySecondChecker() {
    if (this.jobQueue.size === 0) return;
    const jobWrapper = this.jobQueue.dequeue();
    const candles = await this.upbitApi.startJobWrapper(jobWrapper);
    const temp = await this.candlesService.saveCandles(candles);
  }

  @Cron('0 1 9 * * *')
  async everyDayChecker() {
    const markets = await this.upbitApi.getMarkets();
    await this.coinService.saveCoins(markets);
    this.marketQueue.setArray = await this.coinService.findAll();
    const keys = [JOB_NAME['WEEK'], JOB_NAME['MONTH']];
    this.addJobWrapper(keys, 2);
  }
}
