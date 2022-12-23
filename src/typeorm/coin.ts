import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Coin {
  @PrimaryColumn({ type: 'varchar' })
  market: string; // 업비트에서 제공중인 시장 정보	String
  @Column()
  korean_name: string; //	거래 대상 암호화폐 한글명	String
  @Column()
  english_name: string; //	거래 대상 암호화폐 영문명	String
  @Column()
  market_warning: string; //	유의 종목 여부
}
