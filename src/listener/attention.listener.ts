import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import { JobQueue } from 'src/queue';
import { AttentionMarketsQueue } from 'src/queue/attention-market';
import { TaskJob } from 'src/queue/job';
import { AttentionMarket } from 'src/typeorm';

@Injectable()
export class AttentionListener {
  constructor(
    private jobQueue: JobQueue<TaskJob>,
    private attentionMarketsQueue: AttentionMarketsQueue<AttentionMarket>,
    private schedulerRegistry: SchedulerRegistry,
  ) {}
  //attentionCoins: AttentionMarket[]
  @OnEvent('attention.updated')
  handleOrderCreatedEvent(attentionMarket: AttentionMarket[]) {
    this.attentionMarketsQueue.registMarkets(attentionMarket);
    // const temp = this.schedulerRegistry.getIntervals();
    // const jobs = this.jobQueue.getJob();
  }
}
