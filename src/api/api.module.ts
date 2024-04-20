import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { SuppliesService } from './modules/supplies/supplies.service';
import { SuppliesController } from './modules/supplies/supplies.controller';
import { CategoryService } from './modules/category/category.service';
import { CategoryController } from './modules/category/category.controller';
import { EmployeesController } from './modules/employees/employees.controller';
import { EmployeesService } from './modules/employees/employees.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [ApiService, SuppliesService, CategoryService, EmployeesService],
  controllers: [ApiController, SuppliesController, CategoryController, EmployeesController],
  exports: [],
})
export class ApiModule {}
