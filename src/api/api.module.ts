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
import { ProductsController } from './modules/products/products.controller';
import { ProductsService } from './modules/products/products.service';
import { ClientsService } from './modules/clients/clients.service';
import { ClientsController } from './modules/clients/clients.controller';
import { ReceiptsService } from './modules/receipts/receipts.service';
import { ReceiptsController } from './modules/receipts/receipts.controller';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [
    ApiService,
    SuppliesService,
    CategoryService,
    EmployeesService,
    ProductsService,
    ClientsService,
    ReceiptsService,
  ],
  controllers: [
    ApiController,
    SuppliesController,
    CategoryController,
    EmployeesController,
    ProductsController,
    ClientsController,
    ReceiptsController,
  ],
  exports: [],
})
export class ApiModule {}
