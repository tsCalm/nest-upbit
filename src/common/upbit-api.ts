import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import axios from 'axios';
import { Queue } from 'src/queue';
import { TaskJob } from 'src/queue/job';
import { TaskJobWrapper } from 'src/queue/job-wrapper';
import { Candle, Market } from 'src/typeorm';
// import { AttentionMarket, Market } from 'src/typeorm';

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
  async getCandleInfo(job: TaskJob): Promise<Partial<Candle>[]> {
    if (!job || !job.coinName || !job.queryParam) {
      console.error(
        `job: coinName: ${job.coinName}, queryParam: ${job.queryParam} 중 하나가 존재하지 않습니다.`,
      );
      return [];
    }
    const URL = this.configService.get('UPBIT_URL');
    const { data, status, statusText } = await axios.get(
      `${URL}/${job.queryParam}`,
    );
    if (!data) {
      console.log(status, statusText);
      // throw new HttpException(statusText, status);
    }
    return data;
  }
  // async getSTDInfo(market: AttentionMarket): Promise<Partial<IBaseCandle>[]> {
  //   const URL = this.configService.get('UPBIT_URL');
  //   const { data } = await axios.get(
  //     `${URL}/months/merket=${market.coin_market}&count=200`,
  //   );
  //   return data;
  // }

  // async createdAttentionMarket(attentionMarket: AttentionMarket) {
  //   // const months= await this.getCandleInfo()
  // }

  async startJobWrapper(jobWrap: TaskJobWrapper) {
    const result: PromiseSettledResult<Partial<Candle>[]>[] =
      await Promise.allSettled(
        jobWrap.arr.map((job) => {
          return new Promise<Partial<Candle>[]>(async (res, rej) => {
            const candles: Partial<Candle>[] = await this.getCandleInfo(job);
            const fCandles = candles.filter((candle) => candle);
            fCandles.forEach((candle) => (candle.candle_type = job.jobName));
            if (!fCandles) rej();
            res(fCandles);
          });
        }),
      );
    // reject 리스트가 있는지 filter
    const checkStatusReject: PromiseSettledResult<Partial<Candle>[]>[] =
      result.filter((promiseResult) => promiseResult.status === 'rejected');
    // // 이미지가 하나라도 존재하지 않는다면 에러 및 id 리스트로 에러 리턴
    if (checkStatusReject.length > 0) {
      // error log 추가하는 작업 필요
    }
    const statusFulfilled = result.filter(
      (promiseAllSettledResult) =>
        promiseAllSettledResult.status === 'fulfilled',
    );
    return statusFulfilled
      .map(
        (fulfilledItem: PromiseFulfilledResult<Partial<Candle>[]>) =>
          fulfilledItem.value,
      )
      .flat();
  }
}
