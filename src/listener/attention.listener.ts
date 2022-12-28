import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import { JobQueue } from 'src/queue';
import { TaskJob } from 'src/queue/job';
import { AttentionCoin } from 'src/typeorm';

@Injectable()
export class AttentionListener {
  constructor(
    private jobQueue: JobQueue<TaskJob>,
    private schedulerRegistry: SchedulerRegistry,
  ) {}
  //attentionCoins: AttentionCoin[]
  @OnEvent('attention.updated')
  handleOrderCreatedEvent() {
    // const temp = this.schedulerRegistry.getIntervals();
    // const jobs = this.jobQueue.getJob();
  }
}
