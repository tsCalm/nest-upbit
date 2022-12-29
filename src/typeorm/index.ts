import { Market } from './market';
import { Candle } from './candle';
import { AttentionMarket } from './attention-market';
import { StrategyOrder } from './strategy-order';

const entities = [Candle, Market, AttentionMarket, StrategyOrder];

export { Candle, AttentionMarket, Market, StrategyOrder };

export default entities;
