import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Market, AttentionMarket } from '../../../typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CoinsService {
  constructor(
    @InjectRepository(Market) private readonly coinRepo: Repository<Market>,
    @InjectRepository(AttentionMarket)
    private readonly attentionCoinRepo: Repository<AttentionMarket>,
    private eventEmitter: EventEmitter2,
  ) {}

  // 스케줄러에서 사용
  async saveCoins(markets: Market[] = []) {
    const fCoins = markets.filter((coin) => coin.market.includes('KRW'));
    await this.coinRepo.save(fCoins);
  }

  // eventListener에서 감지하기 위한 이벤트를 정의
  async createUpdatedEvent(
    eventName: string,
    attentionMarket: AttentionMarket,
  ) {
    this.eventEmitter.emit(`attention.${eventName}`, attentionMarket);
  }

  // 모든 코인 목록
  findAll() {
    return this.coinRepo.find();
  }

  // 관심 코인 목록
  findAllAttentionCoin() {
    return this.attentionCoinRepo.find();
  }

  findAttentionCoin(market: string) {
    return this.attentionCoinRepo.findOne({
      where: {
        coin_market: market,
      },
    });
  }
  // 관심 코인 등록 및 삭제
  async saveAttentionCoin(market: string) {
    const validateMarket = await this.findAttentionCoin(market);
    let eventName = 'create';
    let eventVal = validateMarket;
    // 이미 관심코인인 경우 관심코인 목록에서 제거
    if (validateMarket) {
      await this.attentionCoinRepo.delete(validateMarket.id);
      eventName = 'delete';
    } else {
      const newAttention = this.attentionCoinRepo.create({
        coin_market: market,
      });
      eventVal = await this.attentionCoinRepo.save(newAttention);
    }
    const attentionMarkets = await this.findAllAttentionCoin();
    this.createUpdatedEvent(eventName, eventVal);
    return attentionMarkets;
  }
}
