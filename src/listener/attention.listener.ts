import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import { UpbitApi } from 'src/common/upbit-api';
import { JOB_NAME, MARKETS } from 'src/enum';
import { Queue } from 'src/queue';
import { TaskJob } from 'src/queue/job';
import { TaskJobWrapper } from 'src/queue/job-wrapper';
import { AttentionMarket } from 'src/typeorm';
import { TASK_JOB_WRAPPER, ATTENTION_MARKET } from '../const';

@Injectable()
export class AttentionListener {
  constructor(
    @Inject(ATTENTION_MARKET)
    private readonly attentionMarketsQueue: Queue<AttentionMarket>,
    @Inject(TASK_JOB_WRAPPER) private readonly jobQueue: Queue<TaskJobWrapper>,
    private readonly taskJobService: TaskJob,
    private readonly jobWrapper: TaskJobWrapper,
    private readonly upbitApi: UpbitApi,
  ) {}

  @OnEvent('attention.create')
  handleAttentionCreate(attentionMarket: AttentionMarket) {
    const keys = Object.keys(JOB_NAME).filter((key) => !key.includes('MINUTE'));
    const jobs = keys.map((key) =>
      this.taskJobService.instance(
        JOB_NAME[key],
        MARKETS[attentionMarket.coin_market],
        200,
      ),
    );
    const jobInstance = this.jobWrapper.instance(jobs, 1);
    this.attentionMarketsQueue.enqueue(attentionMarket);
    this.jobQueue.enqueue(jobInstance);
    this.jobQueue.jobSort();
  }

  @OnEvent('attention.delete')
  handleAttentionDelete(attentionMarket: AttentionMarket) {
    const oldMarkets = this.attentionMarketsQueue.array;
    const newMarkets = oldMarkets.filter(
      (market) => market.coin_market !== attentionMarket.coin_market,
    );
    this.attentionMarketsQueue.array = newMarkets;
  }
}
