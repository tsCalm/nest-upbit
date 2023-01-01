import { JOB_NAME, MARKETS } from '../enum';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { createQueryParam } from 'src/utils/task-job-function';
import { TaskJob } from './job';

// export interface IJob {
//   jobName: JOB_NAME;
//   param: string;
//   getCandle: () => Partial<IBaseCandle[]>;
// }

@Injectable()
export class TaskJobWrapper {
  order: number;
  arr: TaskJob[];

  instance(arr: TaskJob[], order: number = 1) {
    Object.assign(this, { arr, order });
    return { ...this };
  }
}
