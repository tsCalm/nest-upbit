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

  // 일단 기본틀만 제작
  create(createStrategyOrder: CreateStrategyOrder) {
    return this.strategyOrderRepo.save(createStrategyOrder);
  }

  updateComplete(id: number, val: boolean) {
    this.strategyOrderRepo.save({
      id,
      isComplete: val,
    });
  }

  deleteComplete(id: number) {
    this.strategyOrderRepo.delete(id);
  }
}
