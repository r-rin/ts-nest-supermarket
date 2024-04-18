import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { SuppliesService } from './modules/supplies/supplies.service';
import { SuppliesController } from './modules/supplies/supplies.controller';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [ApiService, SuppliesService],
  controllers: [ApiController, SuppliesController],
  exports: [],
})
export class ApiModule {}
