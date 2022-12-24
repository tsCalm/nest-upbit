import { Coin } from './coin';
import { OneMinuteCandle } from './minuts';
import { AttentionCoin } from './attention-coin';
import { StrategyOrder } from './strategy-order';

const entities = [OneMinuteCandle, Coin, AttentionCoin, StrategyOrder];

export { OneMinuteCandle, AttentionCoin, Coin, StrategyOrder };

export default entities;
