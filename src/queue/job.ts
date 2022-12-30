import { JOB_NAME, MARKETS } from '../enum';
import { IBaseCandle } from '../candles/types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { createQueryParam } from 'src/utils/task-job-function';

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

  // constructor(private readonly configService: ConfigService) {}

  instance(jobName: JOB_NAME, coinName: MARKETS, count: number = 1): TaskJob {
    Object.assign(this, { jobName, coinName });
    this.queryParam = createQueryParam(jobName, coinName, count);
    return { ...this };
  }
}
