import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { IEmployee } from './interfaces/IEmployee.interface';

@Injectable()
export class ApiService {
  constructor(private databaseService: DatabaseService) {}

  async getCurrentEmployee(employee_id: string): Promise<IEmployee | null> {
    const queryResult = await this.databaseService.query(
      `SELECT *
      FROM Employee
      WHERE employee_id='${employee_id}'`,
    );

    if (queryResult.length === 0) {
      return null;
    }

    const employeeData = queryResult[0];
    const employee: IEmployee = {
      employee_id: employeeData.employee_id,
      employee_surname: employeeData.employee_surname,
      employee_name: employeeData.employee_name,
      employee_patronymic: employeeData.employee_patronymic,
      employee_role: employeeData.employee_role,
      employee_salary: employeeData.employee_salary,
      employee_start_date: employeeData.employee_start_date,
      employee_birth_date: employeeData.employee_birth_date,
      employee_phone_number: employeeData.employee_phone_number,
      employee_city: employeeData.employee_city,
      employee_street: employeeData.employee_street,
      employee_zip_code: employeeData.employee_zip_code,
    };

    return employee;
  }
}
