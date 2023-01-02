import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Candle, Market } from 'src/typeorm';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class CandlesService {
  constructor(
    @InjectRepository(Candle) private readonly candleRepo: Repository<Candle>,
  ) {}

  async saveCandles(candles: Partial<Candle>[]) {
    return await this.candleRepo.save(candles);
  }

  async deleteCandles(market: Market) {
    // 캔들 중복 저장 테스트 성공으로 과거 캔들을 삭제할 필요가 없음
    // const result: DeleteResult = await this.candleRepo.delete({
    //   market: market.market,
    // });
    // return result;
  }
}
