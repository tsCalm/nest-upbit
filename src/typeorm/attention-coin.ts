import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Coin } from './coin';
import { BaseEntity } from './default';
import { StrategyOrder } from './strategy-order';

@Entity()
export class AttentionCoin extends BaseEntity {
  @OneToOne(() => Coin, (coin) => coin.market, {
    cascade: false,
  })
  @JoinColumn({ name: 'coin_market' })
  coin: Coin;

  @OneToMany(() => StrategyOrder, (stg) => stg.attention_coin)
  strategy_orders: StrategyOrder[];

  @Column({ type: 'varchar', nullable: false })
  coin_market: string;
}
