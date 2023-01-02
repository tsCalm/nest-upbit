import { JOB_NAME, MARKETS } from '../enum';
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

  /**
   *
   * @param jobName 캔들타입과 잡 이름 예) DAY, HOUR_4
   * @param coinName 코인이름 예) KRW-BTC
   * @param count upbit에 요청할 캔들 수
   * @returns
   */
  instance(jobName: JOB_NAME, coinName: MARKETS, count: number = 1): TaskJob {
    Object.assign(this, { jobName, coinName });
    this.queryParam = createQueryParam(jobName, coinName, count);
    return { ...this };
  }
}
