import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, Interval, SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AttentionMarket, Market } from '../typeorm';
import { Queue } from 'src/queue';
import { JOB_NAME, MARKETS } from 'src/enum';
import { TaskJob } from 'src/queue/job';
import { jobNameToTime } from '../utils/task-job-function';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IBaseCandle } from 'src/candles/types';
import { CandlesService } from 'src/candles/services/candles/candles.service';
import { CoinsService } from 'src/markets/services/coins/coins.service';
import { UpbitApi } from 'src/common/upbit-api';
import { TASK_JOB_WRAPPER, ATTENTION_MARKET } from '../const';
import { TaskJobWrapper } from 'src/queue/job-wrapper';

@Injectable()
export class CoinScheduler implements OnModuleInit {
  private markets: Market[] = [];

  constructor(
    @Inject(TASK_JOB_WRAPPER) private readonly jobQueue: Queue<TaskJobWrapper>,
    @Inject(ATTENTION_MARKET)
    private readonly attentionMarketService: Queue<AttentionMarket>,
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
    const attentionCoins: AttentionMarket[] =
      await this.coinService.findAllAttentionCoin();
    this.attentionMarketService.array = attentionCoins;
    const markets = await this.upbitApi.getMarkets();
    await this.coinService.saveCoins(markets);
    this.markets = await this.coinService.findAll();
  }
  // 스케줄러 작업 추가 함수
  addJobWrapper(keys: JOB_NAME[], order: number = 3) {
    const attentionMarkets = this.attentionMarketService.array.map(
      (obj) => obj.coin_market,
    );
    attentionMarkets.forEach((market) => {
      const jobs = keys.map((key) =>
        this.taskJobService.instance(JOB_NAME[key], MARKETS[market]),
      );
      const jobInstance = this.jobWrapper.instance(jobs, 2);
      this.jobQueue.enqueue(jobInstance);
      this.jobQueue.jobSort();
    });
  }

  // 한시간마다 작업 추가
  @Cron('0 0 * * * *')
  oneHourJobs() {
    const keys = [JOB_NAME['DAY'], JOB_NAME['HOUR_4'], JOB_NAME['HOUR_1']];
    this.addJobWrapper(keys, 2);
  }

  // 20초마다 작업 추가
  @Interval(1000 * 20)
  microJobAdd() {
    const keys = [
      JOB_NAME['MINUTE_15'],
      JOB_NAME['MINUTE_10'],
      JOB_NAME['MINUTE_5'],
      JOB_NAME['MINUTE_3'],
      JOB_NAME['MINUTE_1'],
    ];
    this.addJobWrapper(keys, 3);
  }

  // 하루에 한번 업비트 캔들 초기화 시간에 맞춰 정보를 가져온다.
  @Cron('* * * * * *')
  async everySecondChecker() {
    console.log('****');
    console.log(new Date());
    console.log('job task : ', this.jobQueue.array);
    if (this.jobQueue.size === 0) return;
    const jobWrapper = this.jobQueue.dequeue();
    const candles = await this.upbitApi.startJobWrapper(jobWrapper);
    const temp = await this.candlesService.saveCandles(candles);
    console.log('temp : ', temp);
    // console.log('attention market : ', this.attentionMarketService.array);
    console.log('****');
  }

  @Cron('0 0 9 * * *')
  async everyDayChecker() {
    const markets = await this.upbitApi.getMarkets();
    await this.coinService.saveCoins(markets);
    this.markets = await this.coinService.findAll();
    const keys = [JOB_NAME['WEEK'], JOB_NAME['MONTH']];
    this.addJobWrapper(keys, 1);
  }
}
