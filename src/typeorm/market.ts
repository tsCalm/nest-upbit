import { MARKETS } from 'src/enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Candle } from './candle';

@Entity()
export class Market {
  @PrimaryColumn({ type: 'varchar' })
  market: string; // 업비트에서 제공중인 시장 정보	String

  @Column({ type: 'varchar', default: '' })
  korean_name: string; //	거래 대상 암호화폐 한글명	String

  @Column({ type: 'varchar', default: '' })
  english_name: string; //	거래 대상 암호화폐 영문명	String

  @Column({ type: 'varchar', nullable: true, default: null })
  market_warning: string; //	유의 종목 여부

  @Column({ type: 'boolean', default: false })
  attention: boolean;

  @OneToMany(() => Candle, (candle) => candle.market)
  candles: Candle[];
}
