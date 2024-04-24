import { Controller, Get, Param, Query } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/role.enum';

@Controller('api/employees')
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @Get('all')
  @Roles(Role.Admin, Role.Cashier, Role.Manager)
  async allEmployees(
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    return await this.employeesService.getAllEmployees(limit, page);
  }

  @Get('find/:employeeName/:employeeSurname/:employeePatronimic')
  @Roles(Role.Admin, Role.Cashier, Role.Manager)
  async findEmployee(
    @Param('employeeName') employeeName: string,
    @Param('employeeSurname') employeeSurname: string,
    @Param('employeePatronimic') employeePatronimic: string,
  ) {
    return await this.employeesService.findByPIB(
      employeeName,
      employeeSurname,
      employeePatronimic,
    );
  }

  @Get('search')
  @Roles(Role.Admin, Role.Cashier, Role.Manager)
  async searchByFilter(
    @Query('employeeId') id,
    @Query('text') text,
    @Query('employeeRole') role,
    @Query('employeeCity') city,
    @Query('sortBy') sortBy,
    @Query('order') order,
    @Query('limit') limit,
    @Query('page') page,
  ) {
    return this.employeesService.searchByFilter(
      id,
      text,
      role,
      city,
      sortBy,
      order,
      limit,
      page,
    );
  }
}
