import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Market, AttentionMarket } from '../../../typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UpbitApi } from 'src/common/upbit-api';
import { MARKETS } from 'src/enum';

@Injectable()
export class CoinsService {
  constructor(
    @InjectRepository(Market) private readonly coinRepo: Repository<Market>,
    @InjectRepository(AttentionMarket)
    private readonly attentionCoinRepo: Repository<AttentionMarket>,
    private eventEmitter: EventEmitter2,
    private readonly upbitApi: UpbitApi,
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

  findAttentionCoin(market: MARKETS) {
    return this.attentionCoinRepo.findOne({
      where: {
        market: {
          market,
        },
      },
    });
  }

  // 관심 코인 등록 및 삭제
  async saveAttentionCoin(market: MARKETS) {
    const findedMarket = await this.findAttentionCoin(market);
    let eventName = 'create';
    let eventVal = findedMarket;
    // 이미 관심코인인 경우 관심코인 목록에서 제거
    if (findedMarket) {
      await this.attentionCoinRepo.delete(findedMarket.id);
      eventName = 'delete';
    } else {
      const newAttention = this.attentionCoinRepo.create({
        market_name: market,
      });
      eventVal = await this.attentionCoinRepo.save(newAttention);
    }
    const attentionMarkets = await this.findAllAttentionCoin();
    this.createUpdatedEvent(eventName, eventVal);
    return attentionMarkets;
  }
}
