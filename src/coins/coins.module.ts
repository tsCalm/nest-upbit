import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coin, AttentionCoin } from '../typeorm';
import { CoinsService } from './services/coins/coins.service';
import { CoinsController } from './controllers/coins/coins.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Coin, AttentionCoin])],
  providers: [CoinsService],
  exports: [CoinsService],
  controllers: [CoinsController],
})
export class CoinsModule {}
