import { Module } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [ApiService],
  controllers: [ApiController],
  exports: [],
})
export class ApiModule {}
