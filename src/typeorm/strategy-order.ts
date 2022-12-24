import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AttentionCoin } from './attention-coin';
import { Coin } from './coin';
import { BaseEntity } from './default';

@Entity()
export class StrategyOrder extends BaseEntity {
  @ManyToOne(() => AttentionCoin, (coin) => coin.strategy_orders, {})
  @JoinColumn({ name: 'attention_coin_id' })
  attention_coin: AttentionCoin;

  @Column({ type: 'double', nullable: false })
  // 매수제한가격 - 이 가격 아래에서 매수해야한다.
  purchase_limit_price: number;

  @Column({ type: 'double', nullable: true, default: null })
  // 매수가격 - 매수 가격, 전략이 생성된 직후 구매하기 전까지 null값을 유지
  purchase_price: number;

  @Column({ type: 'double', nullable: false })
  sales_limit_price: number;

  @Column({ type: 'double', nullable: false })
  sales_price: number;
}
