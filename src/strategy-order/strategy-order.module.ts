import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StragyOrderController } from './controllers/strategy-order/strategy-order.controller';
import { StragyOrderService } from './services/stragy-order/stragy-order.service';
import { StrategyOrder } from '../typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([StrategyOrder])],
  controllers: [StragyOrderController],
  providers: [StragyOrderService],
})
export class StrategyOrderModule {}
