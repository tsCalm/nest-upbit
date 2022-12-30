import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import axios from 'axios';
import { IBaseCandle } from 'src/candles/types';
import { Queue } from 'src/queue';
import { TaskJob } from 'src/queue/job';
import { TaskJobWrapper } from 'src/queue/job-wrapper';
import { AttentionMarket, Market } from 'src/typeorm';

@Injectable()
export class UpbitApi {
  constructor(private readonly configService: ConfigService) {}

  // 코인 종류 및 코인 정보를 upbit에서 받아와 저장한다.
  async getMarkets(): Promise<Market[]> {
    const URL = this.configService.get('UPBIT_URL');
    const { data } = await axios.get(`${URL}/market/all?isDetails=true`);
    // this.coinService.saveCoins(data);
    return data;
  }

  // scheduler에서 사용
  async getCandleInfo(job: TaskJob): Promise<Partial<IBaseCandle>[]> {
    const URL = this.configService.get('UPBIT_URL');
    const { data } = await axios.get(`${URL}/${job.queryParam}`);
    return data;
  }

  async getSTDInfo(market: AttentionMarket): Promise<Partial<IBaseCandle>[]> {
    const URL = this.configService.get('UPBIT_URL');
    const { data } = await axios.get(
      `${URL}/months/merket=${market.coin_market}&count=200`,
    );
    return data;
  }

  async createdAttentionMarket(attentionMarket: AttentionMarket) {
    // const months= await this.getCandleInfo()
  }

  async startJobWrapper(jobWrap: TaskJobWrapper) {
    const result: PromiseSettledResult<Partial<IBaseCandle>[]>[] =
      await Promise.allSettled(
        jobWrap.arr.map((job) => {
          return new Promise<Partial<IBaseCandle>[]>(async (res, rej) => {
            const candles: Partial<IBaseCandle>[] = await this.getCandleInfo(
              job,
            );
            if (!candles) rej();
            res(candles);
          });
        }),
      );
    // reject 리스트가 있는지 filter
    const checkStatusReject: PromiseSettledResult<Partial<IBaseCandle>[]>[] =
      result.filter((promiseResult) => promiseResult.status === 'rejected');
    // // 이미지가 하나라도 존재하지 않는다면 에러 및 id 리스트로 에러 리턴
    if (checkStatusReject.length > 0) {
      // error log 추가하는 작업 필요
    }
    const statusFulfilled = result.filter(
      (promiseAllSettledResult) =>
        promiseAllSettledResult.status === 'fulfilled',
    );
    return statusFulfilled.map(
      (fulfilledItem: PromiseFulfilledResult<Partial<IBaseCandle>[]>) =>
        fulfilledItem.value,
    );
  }
}
