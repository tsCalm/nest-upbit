import { Get, Injectable, UploadedFile } from '@nestjs/common';
import axios from 'axios';
import { IMinuteCandle } from 'src/candles/types';
import { cvPriveToKo, localeDateOption } from 'src/utils/formater';

@Injectable()
export class CandlesService {
  async getCandleInfo(time: string, unit: number) {
    const { data } = await axios.get(
      `https://api.upbit.com/v1/candles/${time}/${unit}?market=KRW-AXS&count=${unit}`,
    );
    const today = new Date();
    return data.map((obj: IMinuteCandle) => {
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
}
