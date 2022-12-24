import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StrategyOrder } from '../../../typeorm';
import { CreateStrategyOrder } from '../../dtos';

@Injectable()
export class StragyOrderService {
  constructor(
    @InjectRepository(StrategyOrder)
    private readonly strategyOrderRepo: Repository<StrategyOrder>,
  ) {}

  create(createStrategyOrder: CreateStrategyOrder) {
    return createStrategyOrder;
  }
}
