import { Module } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { ApiService } from './api.service';

@Module({
  imports: [DatabaseService],
  providers: [ApiService],
  controllers: [],
  exports: [],
})
export class ApiModule {}
