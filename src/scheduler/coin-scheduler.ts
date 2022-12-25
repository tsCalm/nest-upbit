import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CoinsService } from 'src/coins/services/coins/coins.service';
import { AttentionCoin, Coin } from '../typeorm';
import { jobQueue } from 'src/queue';

import { JOB_NAME, MARKETS } from 'src/enum';
import { TaskJob } from 'src/queue/job';

@Injectable()
export class CoisService implements OnModuleInit {
  private attentionCoins: AttentionCoin[] = [];

  constructor(
    private readonly configService: ConfigService,
    private readonly coinService: CoinsService,
    private readonly taskJobService: TaskJob,
    private readonly testq: jobQueue<{}>,
  ) {}

  async onModuleInit() {
    this.attentionCoins = await this.coinService.findAllAttentionCoin();
    // this.qService.testFunc();
  }

  private async getCoinCandles(unit: number) {
    const URL = this.configService.get('UPBIT_URL');
    const { data } = await axios.get(`${URL}/market/all?isDetails=true`);
  }
  // 하루에 한번 업비트 캔들 초기화 시간에 맞춰 정보를 가져온다.
  @Cron('0 9 * * * *')
  async everyDayChecker() {
    await this.getCoins();
    if (this.attentionCoins.length === 0) return;
  }

  // 코인 종류 및 코인 정보를 upbit에서 받아와 저장한다.
  async getCoins() {
    const URL = this.configService.get('UPBIT_URL');
    const { data } = await axios.get(`${URL}/market/all?isDetails=true`);
    this.coinService.saveCoins(data);
  }

  // 4시간에 한번씩
  @Interval(1000 * 60 * 60 * 4)
  async createFourHourJob() {
    // if (this.testq.size === 0) return;
    this.attentionCoins.forEach((coin) =>
      // coin.coin_market
      {
        const job = this.taskJobService.instance(
          JOB_NAME.HOUR_4,
          MARKETS[coin.coin_market],
        );
        this.testq.enqueue(job);
      },
    );
  }

  // 1시간에 한번씩
  @Interval(1000 * 60 * 60)
  async createOneHourJob() {
    // if (this.testq.size === 0) return;
    this.attentionCoins.forEach((coin) =>
      // coin.coin_market
      {
        const job = this.taskJobService.instance(
          JOB_NAME.HOUR_1,
          MARKETS[coin.coin_market],
        );
        this.testq.enqueue(job);
      },
    );
  }

  @Interval(1000 * 60 * 30)
  async create30MinuteJob() {
    // if (this.testq.size === 0) return;
    this.attentionCoins.forEach((coin) =>
      // coin.coin_market
      {
        const job = this.taskJobService.instance(
          JOB_NAME.MONUTE_30,
          MARKETS[coin.coin_market],
        );
        this.testq.enqueue(job);
      },
    );
  }
  @Interval(1000 * 60 * 15)
  async create15MinuteJob() {
    // if (this.testq.size === 0) return;
    this.attentionCoins.forEach((coin) =>
      // coin.coin_market
      {
        const job = this.taskJobService.instance(
          JOB_NAME.MONUTE_15,
          MARKETS[coin.coin_market],
        );
        this.testq.enqueue(job);
      },
    );
  }

  @Cron('* * * * * *')
  async modernizedAttentionCoins() {
    if (this.testq.size === 0) return;
    const job = this.testq.dequeue();
    console.log(job);
    console.log(this.testq.size);
    // this.attentionCoins = await this.coinService.findAllAttentionCoin();
  }
}
