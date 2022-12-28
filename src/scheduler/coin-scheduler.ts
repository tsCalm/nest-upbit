import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, Interval, SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CoinsService } from 'src/coins/services/coins/coins.service';
import { AttentionCoin, Coin } from '../typeorm';
import { jobQueue } from 'src/queue';
import { JOB_NAME, MARKETS } from 'src/enum';
import { TaskJob } from 'src/queue/job';
import { jobNameToTime } from '../utils/cvJobNameToTime';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CoisService implements OnModuleInit {
  private attentionCoins: AttentionCoin[] = [];

  constructor(
    private readonly configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
    private readonly coinService: CoinsService,
    private readonly taskJobService: TaskJob,
    private readonly jobQueue: jobQueue<TaskJob>,
    private eventEmitter: EventEmitter2,
  ) {}

  async onModuleInit() {
    this.attentionCoins = await this.coinService.findAllAttentionCoin();
    const jobNames = Object.keys(JOB_NAME);
    // 각각의 데이터를 자동으로 가져오는 interval을 생성한다.
    for (const jobName of jobNames) {
      this.schedulerRegistry.addInterval(
        jobName,
        this.createInterval(JOB_NAME[jobName]),
      );
    }
  }

  createInterval(jobName: JOB_NAME) {
    const time = jobNameToTime(jobName);
    const callback = () => {
      this.attentionCoins.forEach((coin) => {
        const job = this.taskJobService.instance(
          JOB_NAME[jobName],
          MARKETS[coin.coin_market],
        );
        this.jobQueue.enqueue(job);
      });
    };

    return setInterval(callback, time);
  }

  // 하루에 한번 업비트 캔들 초기화 시간에 맞춰 정보를 가져온다.
  @Cron('0 9 * * * *')
  async everyDayChecker() {
    await this.getCoins();
  }

  // 코인 종류 및 코인 정보를 upbit에서 받아와 저장한다.
  async getCoins() {
    const URL = this.configService.get('UPBIT_URL');
    const { data } = await axios.get(`${URL}/market/all?isDetails=true`);
    this.coinService.saveCoins(data);
  }

  @Cron('* * * * * *')
  async startJob() {
    if (this.jobQueue.size === 0) return;
    const job = this.jobQueue.dequeue();
    await job.getCandleInfo();
    // this.attentionCoins = await this.coinService.findAllAttentionCoin();
  }
}
