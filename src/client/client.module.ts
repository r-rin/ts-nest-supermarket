import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { EmployeesService } from '../api/modules/employees/employees.service';
import { DatabaseModule } from '../api/database/database.module';
import { ClientService } from './client.service';

@Module({
  imports: [DatabaseModule],
  providers: [EmployeesService, ClientService],
  controllers: [ClientController],
  exports: [],
})
export class ClientModule {}
