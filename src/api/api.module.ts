import { Module } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';

@Module({
  imports: [],
  providers: [ApiService, DatabaseService],
  controllers: [ApiController],
  exports: [],
})
export class ApiModule {}
