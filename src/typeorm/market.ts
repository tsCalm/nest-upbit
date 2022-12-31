import { MARKETS } from 'src/enum';
import { Column, Entity, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { AttentionMarket } from './attention-market';

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

  @OneToOne(() => AttentionMarket, (attention) => attention.market, {})
  attention_coin: AttentionMarket;
}
