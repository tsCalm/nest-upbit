import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CoinsService } from 'src/coins/services/coins/coins.service';
import { Coin } from '../typeorm';

@Injectable()
export class CoisService {
  constructor(
    private readonly configService: ConfigService,
    private readonly coinService: CoinsService,
  ) {}
  @Cron('0 9 * * * *')
  async getCoins() {
    const URL = this.configService.get('UPBIT_URL');
    const { data } = await axios.get(`${URL}/market/all?isDetails=true`);
    this.coinService.saveCoins(data);
  }
}
