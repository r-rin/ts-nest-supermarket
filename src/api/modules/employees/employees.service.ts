import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class EmployeesService {
  constructor(private databaseService: DatabaseService) {}

  async getAllEmployees(limit, page) {
    const response_data = {
      rows: [],
      amount: undefined,
    };

    response_data.rows = await this.databaseService.query(
      `SELECT * 
      FROM Employee
      LIMIT ${limit} OFFSET ${(page - 1) * limit};`,
    );

    const amount = await this.databaseService.query(
      `SELECT COUNT(employee_id)
       FROM Employee;`,
    );

    response_data.amount = amount[0]['COUNT(employee_id)'];

    return response_data;
  }

  findByPIB(employeeName: string, employeeSurname: string, employeePatronimic: string) {
    return this.databaseService.query(
      `SELECT * 
      FROM Employee
      WHERE employee_name LIKE '%${employeeName}%'
        AND employee_surname  LIKE '%${employeeSurname}%'
        AND employee_patronymic LIKE '%${employeePatronimic}%';`,
    );
  }
}
