import { Module } from '@nestjs/common';
import { CoinsService } from './services/coins/coins.service';

@Module({
  providers: [CoinsService]
})
export class CoinsModule {}
