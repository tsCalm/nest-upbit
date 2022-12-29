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

@Injectable()
export class CoinScheduler implements OnModuleInit {
  private markets: Market[] = [];

  constructor(
    private readonly configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
    private readonly coinService: CoinsService,
    private readonly upbitApi: UpbitApi,
    private readonly taskJobService: TaskJob,
    private readonly candlesService: CandlesService,
    @Inject('TASK_JOB') private readonly jobQueue: Queue<TaskJob>,
    @Inject('ATTENTION_MARKET')
    private readonly attentionMarketService: Queue<AttentionMarket>,
    private eventEmitter: EventEmitter2,
  ) {}

  async onModuleInit() {
    const attentionCoins: AttentionMarket[] =
      await this.coinService.findAllAttentionCoin();
    this.attentionMarketService.array = attentionCoins;
    const markets = await this.upbitApi.getMarkets();
    await this.coinService.saveCoins(markets);
    this.markets = await this.coinService.findAll();
    // const jobNames = Object.keys(JOB_NAME);
    // 각각의 데이터를 자동으로 가져오는 interval을 생성한다.
    // for (const jobName of jobNames) {
    //   this.schedulerRegistry.addInterval(
    //     jobName,
    //     this.createInterval(JOB_NAME[jobName]),
    //   );
    // }
  }

  // createInterval(jobName: JOB_NAME) {
  //   const time = jobNameToTime(jobName);
  //   const callback = () => {
  //     for (const coin of this.attentionCoins) {
  //       const job = this.taskJobService.instance(
  //         JOB_NAME[jobName],
  //         MARKETS[coin.coin_market],
  //       );
  //       this.jobQueue.enqueue(job);
  //     }
  //   };
  //   return setInterval(callback, time);
  // }

  // 하루에 한번 업비트 캔들 초기화 시간에 맞춰 정보를 가져온다.
  @Cron('* * * * * *')
  async everySecondChecker() {
    console.log('****');
    console.log(new Date());
    console.log('job task : ', this.jobQueue.array);
    console.log('attention market : ', this.attentionMarketService.array);
    console.log('****');
    // await this.getCoins();
  }

  @Cron('0 9 * * * *')
  async everyDayChecker() {
    // await this.getCoins();
  }

  // @Interval(300)
  // async startJob() {
  //   if (this.jobQueue.size === 0) return;
  // const job = this.jobQueue.dequeue();
  // const candles = await this.getCandleInfo(job);
  // await this.candlesService.saveCandles(candles, JOB_NAME[job.jobName]);
  // }
}
