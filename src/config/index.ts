import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import envFile from './env-option';
import { typeOrmConfigAsync } from './typeorm';

@Module({
  imports: [envFile, TypeOrmModule.forRootAsync(typeOrmConfigAsync)],
})
export class GlobalConfigModule {}
