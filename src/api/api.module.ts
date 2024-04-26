import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { SuppliesService } from './modules/supplies/supplies.service';
import { SuppliesController } from './modules/supplies/supplies.controller';
import { CategoriesService } from './modules/categories/categories.service';
import { CategoriesController } from './modules/categories/categories.controller';
import { EmployeesController } from './modules/employees/employees.controller';
import { EmployeesService } from './modules/employees/employees.service';
import { ProductsController } from './modules/products/products.controller';
import { ProductsService } from './modules/products/products.service';
import { ClientsService } from './modules/clients/clients.service';
import { ClientsController } from './modules/clients/clients.controller';
import { ReceiptsService } from './modules/receipts/receipts.service';
import { ReceiptsController } from './modules/receipts/receipts.controller';
import { StatisticsService } from './modules/statistics/statistics.service';
import { StatisticsController } from './modules/statistics/statistics.controller';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [
    ApiService,
    SuppliesService,
    CategoriesService,
    EmployeesService,
    ProductsService,
    ClientsService,
    ReceiptsService,
    StatisticsService,
  ],
  controllers: [
    ApiController,
    SuppliesController,
    CategoriesController,
    EmployeesController,
    ProductsController,
    ClientsController,
    ReceiptsController,
    StatisticsController,
  ],
  exports: [],
})
export class ApiModule {}
