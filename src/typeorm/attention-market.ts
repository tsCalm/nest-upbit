import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Market } from './market';
import { BaseEntity } from './default';
import { StrategyOrder } from './strategy-order';
import { MARKETS } from 'src/enum';

@Entity()
export class AttentionMarket extends BaseEntity {
  @OneToOne(() => Market, (obj) => obj.attention_coin, {
    cascade: false,
  })
  @JoinColumn({ name: 'market_name' })
  market: Market;

  @OneToMany(() => StrategyOrder, (stg) => stg.attention_coin)
  strategy_orders: StrategyOrder[];

  @Column({ type: 'varchar' })
  market_name: string;
}
