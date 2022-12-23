import { ConfigModule } from '@nestjs/config';

export default ConfigModule.forRoot({
  isGlobal: true,
  cache: true,
  expandVariables: true,
  envFilePath: '.env',
});
