import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { AttentionCoin } from './attention-coin';

@Entity()
export class Coin {
  @PrimaryColumn({ type: 'varchar', default: '' })
  market: string; // 업비트에서 제공중인 시장 정보	String

  @Column({ type: 'varchar', default: '' })
  korean_name: string; //	거래 대상 암호화폐 한글명	String

  @Column({ type: 'varchar', default: '' })
  english_name: string; //	거래 대상 암호화폐 영문명	String

  @Column({ type: 'varchar', nullable: true, default: null })
  market_warning: string; //	유의 종목 여부

  @OneToOne(() => AttentionCoin, (attention) => attention.coin)
  attention_coin: AttentionCoin;
}
