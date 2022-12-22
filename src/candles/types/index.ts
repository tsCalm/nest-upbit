export interface IMinuteCandle {
  market: string; // 마켓명
  candle_date_time_utc: Date; //캔들 기준 시각(UTC 기준)
  candle_date_time_kst: Date; //캔들 기준 시각(KST 기준)
  opening_price: number; //시가
  high_price: number; // 고가
  low_price: number; // 저가
  trade_price: number; // 종가
  timestamp: number; //해당 캔들에서 마지막 틱이 저장된 시각
  candle_acc_trade_price: number; //누적 거래 금액
  candle_acc_trade_volume: number; //누적 거래량
  unit: number; // 분 단위(유닛)	Integer
}
