import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coin, AttentionCoin } from '../typeorm';
import { CoinsService } from './services/coins/coins.service';
import { CoinsController } from './controllers/coins/coins.controller';
import { AttentionCoinsController } from './controllers/coins/attention-coins.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Coin, AttentionCoin])],
  controllers: [CoinsController, AttentionCoinsController],
  providers: [CoinsService],
  exports: [CoinsService],
})
export class CoinsModule {}
