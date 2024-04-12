import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ApiService } from '../api/api.service';
import { DatabaseService } from '../api/database/database.service';

@Module({
  imports: [],
  providers: [ApiService, DatabaseService],
  controllers: [ClientController],
  exports: [],
})
export class ClientModule {}
