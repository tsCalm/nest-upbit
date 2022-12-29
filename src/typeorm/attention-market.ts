import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Market } from './market';
import { BaseEntity } from './default';
import { StrategyOrder } from './strategy-order';

@Entity()
export class AttentionMarket extends BaseEntity {
  @OneToOne(() => Market, (coin) => coin.market, {
    cascade: false,
  })
  @JoinColumn({ name: 'coin_market' })
  coin: Market;

  @OneToMany(() => StrategyOrder, (stg) => stg.attention_coin)
  strategy_orders: StrategyOrder[];

  @Column({ type: 'varchar', nullable: false })
  coin_market: string;
}
