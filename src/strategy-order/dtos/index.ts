import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateStrategyOrder {
  @IsNotEmpty()
  @IsInt()
  attention_coin_id: number;

  @IsNotEmpty()
  @IsNumber()
  purchase_limit_price: number;

  @IsNotEmpty()
  @IsNumber()
  sales_limit_price: number;
}
