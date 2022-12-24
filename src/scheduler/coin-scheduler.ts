import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CoinsService } from 'src/coins/services/coins/coins.service';
import { AttentionCoin, Coin } from '../typeorm';

@Injectable()
export class CoisService implements OnModuleInit {
  private attentionCoins: AttentionCoin[] = [];

  constructor(
    private readonly configService: ConfigService,
    private readonly coinService: CoinsService,
  ) {}

  async onModuleInit() {
    this.attentionCoins = await this.coinService.findAllAttentionCoin();
    console.log(this.attentionCoins);
  }

  private async getCoinCandles(unit: number) {
    const URL = this.configService.get('UPBIT_URL');
    const { data } = await axios.get(`${URL}/market/all?isDetails=true`);
  }

  @Cron('0 9 * * * *')
  async everyDayChecker() {
    await this.getCoins();
    if (this.attentionCoins.length === 0) return;
  }

  // 코인 종류 및 코인 정보를 upbit에서 받아와 저장한다.
  async getCoins() {
    const URL = this.configService.get('UPBIT_URL');
    const { data } = await axios.get(`${URL}/market/all?isDetails=true`);
    this.coinService.saveCoins(data);
  }

  // 관심 코인이 DB에 존재하는지 매분 0초에 확인하고 scheduler 로컬변수에 추가한다.
  @Cron('0 * * * * *')
  async modernizedAttentionCoins() {
    this.attentionCoins = await this.coinService.findAllAttentionCoin();
  }

  async attentionCoinCandleSave(markets: string[]) {
    for (const market of markets) {
      // https://api.upbit.com/v1/candles/days?market=KRW-BTC&count=10
      const { data } = await axios.get(
        `${URL}/candles/days/market=${market}&count=200`,
      );
    }
  }
}
