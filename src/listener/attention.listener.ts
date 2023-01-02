import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CandlesService } from 'src/candle/services/candles/candles.service';
import { UpbitApi } from 'src/common/upbit-api';
import { JOB_NAME, MARKETS } from 'src/enum';
import { Queue } from 'src/queue';
import { TaskJob } from 'src/queue/job';
import { TaskJobWrapper } from 'src/queue/job-wrapper';
import { Market } from 'src/typeorm';
// import { AttentionMarket } from 'src/typeorm';
import { TASK_JOB_WRAPPER, MARKET } from '../const';

@Injectable()
export class AttentionListener {
  constructor(
    @Inject(MARKET)
    private readonly marketQueue: Queue<Market>,
    @Inject(TASK_JOB_WRAPPER) private readonly jobQueue: Queue<TaskJobWrapper>,
    private readonly taskJobService: TaskJob,
    private readonly jobWrapper: TaskJobWrapper,
    private readonly upbitApi: UpbitApi,
    private readonly candleService: CandlesService,
  ) {}

  @OnEvent('attention.create')
  handleAttentionCreate(market: Market) {
    const keys = Object.keys(JOB_NAME).filter((key) => !key.includes('MINUTE'));
    console.log('keys : ', keys);
    const jobs = keys.map((key) =>
      this.taskJobService.instance(JOB_NAME[key], MARKETS[market.market], 200),
    );
    const jobInstance = this.jobWrapper.instance(jobs, 2);
    this.jobQueue.enqueue(jobInstance);
    this.jobQueue.jobSort();
  }

  @OnEvent('attention.delete')
  handleAttentionDelete(market: Market) {
    this.candleService.deleteCandles(market);
  }
}
