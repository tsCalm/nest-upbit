import { JOB_NAME, MARKETS } from '../enum';
import { IBaseCandle } from '../candles/types';
import { Injectable } from '@nestjs/common';
export interface IJob {
  jobName: JOB_NAME;
  param: string;
  getCandle: () => Partial<IBaseCandle[]>;
}

@Injectable()
export class TaskJob {
  jobName: JOB_NAME;
  queryParam: string = '';
  coinName: MARKETS;

  constructor() {}

  instance(jobName: JOB_NAME, coinName: MARKETS) {
    Object.assign(this, { jobName, coinName });
    this.createqueryParam();
    return { ...this };
  }

  public getCandle(): void {}
  public saveCandle(): void {}

  createqueryParam() {
    const queryParamList = {
      // DAY: `days?market=KRW-BTC&count=10`
      DAY: `days?market=${this.coinName}`,
      WEEK: `weeks?market=${this.coinName}`,
      MONTH: `months?market=${this.coinName}`,
      HOUR_4: `minutes/240?market=${this.coinName}`,
      HOUR_1: `minutes/60?market=${this.coinName}`,
      MONUTE_30: `minutes/30?market=${this.coinName}`,
      MONUTE_15: `minutes/15?market=${this.coinName}`,
      MONUTE_10: `minutes/10?market=${this.coinName}`,
      MONUTE_5: `minutes/5?market=${this.coinName}`,
      MONUTE_3: `minutes/3?market=${this.coinName}`,
      MONUTE_1: `minutes/1?market=${this.coinName}`,
    };
    this.queryParam = `candles/${queryParamList[this.jobName]}&count=10`;
  }
}
