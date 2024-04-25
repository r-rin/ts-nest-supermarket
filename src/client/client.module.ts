import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { EmployeesService } from '../api/modules/employees/employees.service';
import { DatabaseModule } from '../api/database/database.module';
import { ClientService } from './client.service';
import { ClientsService } from '../api/modules/clients/clients.service';
import { ApiService } from '../api/api.service';
import { CategoriesService } from '../api/modules/categories/categories.service';
import { ProductsService } from '../api/modules/products/products.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    EmployeesService,
    ClientService,
    ClientsService,
    ApiService,
    CategoriesService,
    ProductsService
  ],
  controllers: [ClientController],
  exports: [],
})
export class ClientModule {}
