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
  jobName: JOB_NAME;
  queryParam: string = '';
  coinName: MARKETS;

  constructor(private readonly configService: ConfigService) {}

  instance(jobName: JOB_NAME, coinName: MARKETS): TaskJob {
    Object.assign(this, { jobName, coinName });
    this.createqueryParam();
    return this;
  }

  public async getCandleInfo(): Promise<Partial<IBaseCandle>[]> {
    const URL = this.configService.get('UPBIT_URL');
    const { data } = await axios.get(`${URL}/${this.queryParam}`);
    return data;
  }
  public saveCandle(): void {}

  createqueryParam() {
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
    this.queryParam = `candles/${queryParamList[this.jobName]}&count=10`;
  }
}
