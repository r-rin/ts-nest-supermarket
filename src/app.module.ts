import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { ClientModule } from './client/client.module';

@Module({
  imports: [ApiModule, ClientModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
