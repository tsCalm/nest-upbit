import { Get, Injectable, UploadedFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { IBaseCandle, IMinuteCandle } from 'src/candles/types';
import { JOB_NAME } from 'src/enum';
import { Candle } from 'src/typeorm';
import { cvPriveToKo, localeDateOption } from 'src/utils/formatter';
import { Repository } from 'typeorm';

@Injectable()
export class CandlesService {
  constructor(
    @InjectRepository(Candle)
    private readonly candleRepo: Repository<Candle>,
  ) {}
  // async getCandleInfo(time: string, unit: number) {
  //   const { data } = await axios.get(
  //     `https://api.upbit.com/v1/candles/${time}/3?market=KRW-MLK&count=${unit}`,
  //   );
  //   // const result = await this.candleRepo.save(data);
  //   return data.map((obj: IMinuteCandle) => {
  //     return {
  //       시각: new Date(obj.candle_date_time_kst).toLocaleDateString(
  //         'ko',
  //         localeDateOption,
  //       ),
  //       누적거래금액: cvPriveToKo(obj.candle_acc_trade_price),
  //       누적거래량: Math.ceil(obj.candle_acc_trade_volume),
  //       종가: obj.trade_price,
  //     };
  //   });
  // }

  async findOneMCandle() {
    const result = await this.candleRepo.find({
      order: {
        candle_date_time_utc: 'DESC',
      },
    });
    return result.map((obj: IMinuteCandle) => {
      return {
        시각: new Date(obj.candle_date_time_kst).toLocaleDateString(
          'ko',
          localeDateOption,
        ),
        누적거래금액: cvPriveToKo(obj.candle_acc_trade_price),
        누적거래량: Math.ceil(obj.candle_acc_trade_volume),
        종가: obj.trade_price,
      };
    });
  }

  async saveCandles(candles: Partial<IBaseCandle>[]) {
    // const candleInstance = candles.map((candle) => {
    //   return this.candleRepo.create({
    //     ...candle,
    //     candle_type: jobName,
    //   });
    // });
    return await this.candleRepo.save(candles);
  }
}
