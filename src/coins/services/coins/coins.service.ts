import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coin } from '../../../typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CoinsService {
  constructor(
    @InjectRepository(Coin) private readonly coinRepo: Repository<Coin>,
  ) {}

  // 스케줄러에서 사용
  async saveCoins(coins: Coin[] = []) {
    const fCoins = coins.filter((coin) => coin.market.includes('KRW'));
    await this.coinRepo.save(fCoins);
    console.log('코인 정보 저장 완료');
  }

  findAll() {
    return this.coinRepo.find();
  }
}
