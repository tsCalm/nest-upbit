import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Market, AttentionMarket } from '../typeorm';
import { AttentionCoinsController } from './controllers/coins/attention-coins.controller';
import { CoinsController } from './controllers/coins/coins.controller';
import { CoinsService } from './services/coins/coins.service';

@Module({
  imports: [TypeOrmModule.forFeature([Market, AttentionMarket])],
  controllers: [CoinsController, AttentionCoinsController],
  providers: [CoinsService],
  exports: [CoinsService],
})
export class MarketsModule {}
