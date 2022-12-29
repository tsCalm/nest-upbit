import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import { UpbitApi } from 'src/common/upbit-api';
import { Queue } from 'src/queue';
import { TaskJob } from 'src/queue/job';
import { AttentionMarket } from 'src/typeorm';
import { TASK_JOB, ATTENTION_MARKET } from '../const';

@Injectable()
export class AttentionListener {
  constructor(
    @Inject(ATTENTION_MARKET)
    private readonly attentionMarketsQueue: Queue<AttentionMarket>,
    @Inject(TASK_JOB) private readonly jobQueue: Queue<TaskJob>,
    private readonly taskJobService: TaskJob,
    private readonly upbitApi: UpbitApi,
  ) {}

  @OnEvent('attention.create')
  handleAttentionCreate(attentionMarket: AttentionMarket) {
    // const jobName = ['DAY', 'WEEK', 'MONTH'];
    const market = attentionMarket.coin_market;
    this.attentionMarketsQueue.enqueue(attentionMarket);
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
