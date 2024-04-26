import { Body, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/role.enum';
import { AddEmployeeDTO } from '../../dto/add-employee.dto';
import { IResponseInterface } from '../../interfaces/IResponse.interface';
import { EditEmployeeDTO } from '../../dto/edit-employee.dto';

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

  @Post('add')
  @Roles(Role.Admin, Role.Manager)
  async addNewEmployee(
    @Req() req,
    @Body() addEmployeeDTO: AddEmployeeDTO,
  ): Promise<IResponseInterface> {
    return await this.employeesService.addNewEmployee(req, addEmployeeDTO);
  }

  @Post('edit')
  @Roles(Role.Admin, Role.Manager)
  async editEmployee(
    @Req() req,
    @Body() editEmployeeDTO: EditEmployeeDTO,
  ): Promise<IResponseInterface> {
    return await this.employeesService.editEmployee(req, editEmployeeDTO);
  }

  @Delete('delete')
  @Roles(Role.Admin, Role.Manager)
  async deleteEmployee(@Req() req, @Query('id') id) {
    return await this.employeesService.deleteEmployee(req, id);
  }
}
