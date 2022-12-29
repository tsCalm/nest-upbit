import { JOB_NAME, MARKETS } from '../enum';
import { IBaseCandle } from '../candles/types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

// export interface IJob {
//   jobName: JOB_NAME;
//   param: string;
//   getCandle: () => Partial<IBaseCandle[]>;
// }

@Injectable()
export class TaskJob {
  jobName: string;
  queryParam: string = '';
  coinName: MARKETS;

  // constructor(private readonly configService: ConfigService) {}

  instance(jobName: string, coinName: MARKETS): TaskJob {
    Object.assign(this, { jobName, coinName });
    this.createqueryParam();
    return { ...this };
  }

  private createqueryParam() {
    const queryParamList = {
      // DAY: `days?market=KRW-BTC&count=10`
      DAY: `days?market=${this.coinName}`,
      WEEK: `weeks?market=${this.coinName}`,
      MONTH: `months?market=${this.coinName}`,
      HOUR_4: `minutes/240?market=${this.coinName}`,
      HOUR_1: `minutes/60?market=${this.coinName}`,
      MINUTE_30: `minutes/30?market=${this.coinName}`,
      MINUTE_15: `minutes/15?market=${this.coinName}`,
      MINUTE_10: `minutes/10?market=${this.coinName}`,
      MINUTE_5: `minutes/5?market=${this.coinName}`,
      MINUTE_3: `minutes/3?market=${this.coinName}`,
      MINUTE_1: `minutes/1?market=${this.coinName}`,
    };
    this.queryParam = `candles/${queryParamList[this.jobName]}&count=1`;
  }
}
