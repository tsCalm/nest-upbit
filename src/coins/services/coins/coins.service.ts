import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coin, AttentionCoin } from '../../../typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CoinsService {
  constructor(
    @InjectRepository(Coin) private readonly coinRepo: Repository<Coin>,
    @InjectRepository(AttentionCoin)
    private readonly attentionCoinRepo: Repository<AttentionCoin>,
  ) {}

  // 스케줄러에서 사용
  async saveCoins(coins: Coin[] = []) {
    const fCoins = coins.filter((coin) => coin.market.includes('KRW'));
    await this.coinRepo.save(fCoins);
    console.log('코인 정보 저장 완료');
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
    // 이미 관심코인인 경우 관심코인 목록에서 제거
    if (validateMarket) {
      return this.attentionCoinRepo.delete(validateMarket);
    }
    const newAttention = this.attentionCoinRepo.create({ coin_market: market });
    return this.attentionCoinRepo.save(newAttention);
  }
}
