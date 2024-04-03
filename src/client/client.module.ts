import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [ClientController],
  exports: [],
})
export class ClientModule {}
