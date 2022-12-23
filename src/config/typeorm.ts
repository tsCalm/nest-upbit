import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import entities from '../typeorm';

class TypeOrmConfig {
  static getConfig(configService: ConfigService): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: configService.get('DB_HOST'),
      port: Number(configService.get('DB_PORT')),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
      entities,
      synchronize: true,
      // configService.get('NODE_ENV') === 'dev',
      logging: true,
      autoLoadEntities: true,
      timezone: 'z',
      charset: 'utf8mb4',
    };
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  useFactory: async (configService: ConfigService) =>
    TypeOrmConfig.getConfig(configService),
  inject: [ConfigService],
};
