import { NestFactory } from '@nestjs/core';
import { QuoationService } from 'node-upbit';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
