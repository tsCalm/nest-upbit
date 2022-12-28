import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AttentionCoin } from 'src/typeorm';

@Injectable()
export class AttentionListener {
  //attentionCoins: AttentionCoin[]
  @OnEvent('attention.updated')
  handleOrderCreatedEvent() {
    console.log('attention.updated : ');
  }
}
