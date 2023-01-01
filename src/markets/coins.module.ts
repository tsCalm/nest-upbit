import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpbitApi } from 'src/common/upbit-api';
import { Market } from '../typeorm';
import { AttentionCoinsController } from './controllers/coins/attention-coins.controller';
import { CoinsController } from './controllers/coins/coins.controller';
import { CoinsService } from './services/coins/coins.service';

@Module({
  imports: [TypeOrmModule.forFeature([Market])],
  controllers: [CoinsController, AttentionCoinsController],
  providers: [CoinsService, UpbitApi],
  exports: [CoinsService],
})
export class MarketsModule {}
