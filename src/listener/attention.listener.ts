import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import { UpbitApi } from 'src/common/upbit-api';
import { JobQueue } from 'src/queue';
import { AttentionMarketsQueue } from 'src/queue/attention-market';
import { TaskJob } from 'src/queue/job';
import { AttentionMarket } from 'src/typeorm';

@Injectable()
export class AttentionListener {
  autoCandleList = ['days', 'weeks', 'months'];
  constructor(
    private jobQueue: JobQueue<TaskJob>,
    private attentionMarketsQueue: AttentionMarketsQueue<AttentionMarket>,
    private schedulerRegistry: SchedulerRegistry,
    private readonly upbitApi: UpbitApi,
  ) {}

  @OnEvent('attention.create')
  handleAttentionCreate(attentionMarket: AttentionMarket) {
    this.attentionMarketsQueue.enqueue(attentionMarket);
    // const temp = this.schedulerRegistry.getIntervals();
    // const jobs = this.jobQueue.getJob();
  }

  @OnEvent('attention.delete')
  handleAttentionDelete(attentionMarket: AttentionMarket) {
    const oldMarkets = this.attentionMarketsQueue.getList();
    const newMarkets = oldMarkets.filter(
      (market) => market.coin_market !== attentionMarket.coin_market,
    );
    this.attentionMarketsQueue.registMarkets(newMarkets);
  }
}
