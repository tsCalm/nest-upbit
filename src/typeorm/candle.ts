import { JOB_NAME } from 'src/enum';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './default';
import { Market } from './market';

@Entity()
export class Candle {
  @ManyToOne(() => Market, (market) => market.candles, {})
  @JoinColumn({ name: 'market' })
  marketEntity: Market;

  @PrimaryColumn({ type: 'varchar', default: 'DAY' })
  candle_type: string;

  @PrimaryColumn({ type: 'varchar' })
  market: string;

  @PrimaryColumn({ type: 'varchar', default: '' })
  candle_date_time_utc: string; //캔들 기준 시각(UTC 기준)

  @Column({ type: 'varchar', default: null })
  candle_date_time_kst: string; //캔들 기준 시각(KST 기준)

  @Column({ type: 'int', default: null })
  day_of_week: number;

  @Column({ type: 'double' })
  opening_price: number; //시가

  @Column({ type: 'double' })
  high_price: number; // 고가

  @Column({ type: 'double' })
  low_price: number; // 저가

  @Column({ type: 'double' })
  trade_price: number; // 종가

  @Column({ type: 'bigint' })
  timestamp: number; //해당 캔들에서 마지막 틱이 저장된 시각

  @Column({ type: 'double' })
  candle_acc_trade_price: number; //누적 거래 금액

  @Column({ type: 'double' })
  candle_acc_trade_volume: number; //누적 거래량

  @Column({ type: 'varchar', nullable: true, default: null })
  first_day_of_period: string;

  @Column({ type: 'double', nullable: true, default: null })
  prev_closing_price: number; //누적 거래량

  @Column({ type: 'double', nullable: true, default: null })
  change_price: number; //누적 거래량

  @Column({ type: 'double', nullable: true, default: null })
  change_rate: number; //누적 거래량

  @Column({ type: 'double', nullable: true, default: null })
  converted_trade_price: number; //누적 거래량

  @Column({ type: 'int', default: null })
  unit: number; // 분 단위(유닛)	Integer
}
