import { JOB_NAME, MARKETS } from '../enum';
import { IBaseCandle } from '../candles/types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AttentionCoin } from 'src/typeorm';

// export interface IJob {
//   jobName: JOB_NAME;
//   param: string;
//   getCandle: () => Partial<IBaseCandle[]>;
// }

@Injectable()
export class AttentionMarketsQueue<T> {
  attention_coins = [];

  public registMarkets(arr: T[] = []) {
    this.attention_coins = arr;
  }

  public enqueue(data: T) {
    this.attention_coins.push(data); // 배열에 요소를 추가한다
  }

  public dequeue(): T {
    return this.attention_coins.shift(); // 첫번째 요소를 반환하고 제거한다.
  }

  public getList() {
    return this.attention_coins;
  }
}
