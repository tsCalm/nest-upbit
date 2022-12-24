import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateStrategyOrder } from '../../dtos';
import { StragyOrderService } from '../../services/stragy-order/stragy-order.service';

@Controller('strategy-order')
export class StragyOrderController {
  constructor(private readonly stragyOrderService: StragyOrderService) {}

  @Post('create')
  @UsePipes(new ValidationPipe())
  createStrategyOrder(@Body() createStrategyOrder: CreateStrategyOrder) {
    return this.stragyOrderService.create(createStrategyOrder);
  }
}
