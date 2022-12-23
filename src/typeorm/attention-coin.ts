import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Coin } from './coin';
import { BaseEntity } from './default';

@Entity()
export class AttentionCoin extends BaseEntity {
  @OneToOne(() => Coin, (coin) => coin.market, {
    cascade: false,
  })
  @JoinColumn({ name: 'coin_market' })
  coin: Coin;

  @Column({ type: 'varchar', nullable: false })
  coin_market: string;
}
