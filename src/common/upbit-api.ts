import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import axios from 'axios';
import { IBaseCandle } from 'src/candles/types';
import { JobQueue } from 'src/queue';
import { TaskJob } from 'src/queue/job';
import { AttentionCoin, Coin } from 'src/typeorm';

@Injectable()
export class UpbitApi {
  constructor(private readonly configService: ConfigService) {}

  // 코인 종류 및 코인 정보를 upbit에서 받아와 저장한다.
  async getMarkets(): Promise<Coin[]> {
    const URL = this.configService.get('UPBIT_URL');
    const { data } = await axios.get(`${URL}/market/all?isDetails=true`);
    // this.coinService.saveCoins(data);
    return data;
  }

  async getCandleInfo(job: TaskJob): Promise<Partial<IBaseCandle>[]> {
    const URL = this.configService.get('UPBIT_URL');
    const { data } = await axios.get(`${URL}/${job.queryParam}`);
    return data;
  }
}
