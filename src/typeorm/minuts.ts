import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class OneMinuteCandle {
  @PrimaryColumn({ type: 'varchar' })
  candle_date_time_utc: Date; //캔들 기준 시각(UTC 기준)
  @Column({ type: 'varchar' })
  candle_date_time_kst: Date; //캔들 기준 시각(KST 기준)
  @Column({ type: 'double' })
  opening_price: number; //시가
  @Column({ type: 'double' })
  high_price: number; // 고가
  @Column({ type: 'double' })
  low_price: number; // 저가
  @Column({ type: 'double' })
  trade_price: number; // 종가
  @Column({ type: 'longblob' })
  timestamp: number; //해당 캔들에서 마지막 틱이 저장된 시각
  @Column({ type: 'double' })
  candle_acc_trade_price: number; //누적 거래 금액
  @Column({ type: 'double' })
  candle_acc_trade_volume: number; //누적 거래량
  @Column({ type: 'int' })
  unit: number; // 분 단위(유닛)	Integer
}
