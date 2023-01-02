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

  /**
   *
   * @param arr 작업 배열 예) [한시간캔들불러오기, 30분캔들불러오기]
   * @param order 스케줄러에서 처리할 작업의 우선순위 낮을수록 빨리처리, default=1
   * @returns
   */
  instance(arr: TaskJob[], order: number = 1) {
    Object.assign(this, { arr, order });
    return { ...this };
  }
}
