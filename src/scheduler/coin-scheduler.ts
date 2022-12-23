import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CoisService {
  constructor(private readonly configService: ConfigService) {}
  @Cron('* * * * * *')
  getCoins() {
    const test = this.configService.get('UPBIT_URL');
    console.log(test);
  }
}
