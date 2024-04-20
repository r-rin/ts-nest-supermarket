import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { SuppliesService } from './modules/supplies/supplies.service';
import { SuppliesController } from './modules/supplies/supplies.controller';
import { CategoryService } from './modules/category/category.service';
import { CategoryController } from './modules/category/category.controller';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [ApiService, SuppliesService, CategoryService],
  controllers: [ApiController, SuppliesController, CategoryController],
  exports: [],
})
export class ApiModule {}
