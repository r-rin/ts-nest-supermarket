import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/role.enum';

@Controller('api/employees')
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {
  }

  @Get('all')
  @Roles(Role.Admin, Role.Cashier, Role.Manager)
  async allCategories(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
  ) {
    return await this.employeesService.getAllEmployees(limit, page);
  }

  @Get('find/:employeeName/:employeeSurname/:employeePatronimic')
  @Roles(Role.Admin, Role.Cashier, Role.Manager)
  async findCategory(
    @Param('employeeName') employeeName: string,
    @Param('employeeSurname') employeeSurname: string,
    @Param('employeePatronimic') employeePatronimic: string,
  ) {
    return await this.employeesService.findByPIB(employeeName, employeeSurname, employeePatronimic);
  }
}