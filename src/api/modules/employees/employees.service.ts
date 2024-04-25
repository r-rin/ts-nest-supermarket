import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { IEmployee } from '../../interfaces/IEmployee.interface';
import { IResponseInterface } from '../../interfaces/IResponse.interface';
import { AddEmployeeDTO } from '../../dto/add-employee.dto';
import * as bcrypt from 'bcrypt';

function filterQueryBuilder(id, text, role, city, sortBy, order, limit, page) {
  if (!id) id = '';
  if (!text) {
    text = '';
  } else {
    // I'm not sure if this is safe...
    // Hope no one will pass SQL injections into text...
    text = decodeURIComponent(text);
  }

  let queryBase = `
    SELECT *
    FROM Employee
    WHERE employee_id LIKE '%${id}%'
    AND ( employee_surname LIKE '%${text}%'
        OR employee_name LIKE '%${text}%'
        OR COALESCE(employee_patronymic, '') LIKE '%${text}%'
        OR employee_phone_number LIKE '%${text}%'
        OR employee_city LIKE '%${text}%'
        OR employee_street LIKE '%${text}%'
        OR employee_zip_code LIKE '%${text}%')`;

  if (role && role != 'all') queryBase += ` AND employee_role = ${role}`;
  if (city && city != 'all') queryBase += ` AND employee_city = '${city}'`;
  if (sortBy && sortBy != 'none') queryBase += ` ORDER BY ${sortBy} ${order}`;
  if (limit) queryBase += ` LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
  queryBase += ';';

  return queryBase;
}

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

  async getEmployee(employee_id: string): Promise<IEmployee> {
    const queryResult = await this.databaseService.query(
      `SELECT * 
      FROM Employee
      WHERE employee_id = '${employee_id}';`,
    );

    if (queryResult.length == 0) return null;

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

  findByPIB(
    employeeName: string,
    employeeSurname: string,
    employeePatronimic: string,
  ) {
    return this.databaseService.query(
      `SELECT * 
      FROM Employee
      WHERE employee_name LIKE '%${employeeName}%'
        AND employee_surname  LIKE '%${employeeSurname}%'
        AND employee_patronymic LIKE '%${employeePatronimic}%';`,
    );
  }

  async getAllTowns() {
    const queryResult = await this.databaseService.query(
      `SELECT DISTINCT employee_city
      FROM Employee;`,
    );
    return queryResult;
  }

  async searchByFilter(id, text, role, city, sortBy, order, limit, page) {
    const query = filterQueryBuilder(
      id,
      text,
      role,
      city,
      sortBy,
      order,
      limit,
      page,
    );
    const allQuery = filterQueryBuilder(
      id,
      text,
      role,
      city,
      sortBy,
      order,
      null,
      null,
    );
    const queryResult = await this.databaseService.query(query);
    const allQueryResult = await this.databaseService.query(allQuery);

    return {
      rows: queryResult,
      amount: allQueryResult.length,
    };
  }

  async addNewEmployee(
    req,
    addEmployeeDTO: AddEmployeeDTO,
  ): Promise<IResponseInterface> {
    const doExists: IEmployee = await this.getEmployee(
      addEmployeeDTO.employee_id,
    );

    if (req.currentEmployee.employee_role === 0)
      return {
        success: false,
        title: 'Виникла помилка!',
        description: `Недостатньо прав для додавання працівників!`,
      };

    if (
      (addEmployeeDTO.employee_role == 3 ||
        addEmployeeDTO.employee_role == 2) &&
      req.currentEmployee.employee_role == 1
    )
      return {
        success: false,
        title: 'Виникла помилка!',
        description: `Недостатньо прав для додавання працівників заданої ролі!`,
      };

    if (doExists)
      return {
        success: false,
        title: 'Виникла помилка!',
        description: `Працівник з ID ${addEmployeeDTO.employee_id} вже існує!`,
      };

    await this.databaseService.query(`
    INSERT INTO Employee (employee_id, employee_surname, employee_name, employee_patronymic, employee_role,
                      employee_salary, employee_start_date, employee_birth_date, employee_phone_number,
                      employee_city, employee_street, employee_zip_code)
    VALUES ('${addEmployeeDTO.employee_id}',
            '${addEmployeeDTO.employee_surname}',
            '${addEmployeeDTO.employee_name}',
            '${addEmployeeDTO.employee_patronymic ? addEmployeeDTO.employee_patronymic : 'NULL'}',
            ${addEmployeeDTO.employee_role},
            ${addEmployeeDTO.employee_salary},
            '${addEmployeeDTO.employee_start_date.toISOString().slice(0, 19).replace('T', ' ')}',
            '${addEmployeeDTO.employee_birth_date.toISOString().slice(0, 19).replace('T', ' ')}',
            '${addEmployeeDTO.employee_phone_number}',
            '${addEmployeeDTO.employee_city}',
            '${addEmployeeDTO.employee_street}',
            '${addEmployeeDTO.employee_zip_code}');
    `);

    const hashed_password = bcrypt.hash(addEmployeeDTO.password_raw, 10);

    await this.databaseService.query(`
    INSERT INTO Auth_data (employee_id, password_hash)
    VALUES (
            '${addEmployeeDTO.employee_id}',
            '${hashed_password}'
           )
    `);

    return {
      success: true,
      title: 'Працівника успішно додано!',
      description: `Працівник з ID ${addEmployeeDTO.employee_id} був доданий!`,
    };
  }

  async deleteEmployee(req, id): Promise<IResponseInterface> {
    if (req.currentEmployee.employee_id == id)
      return {
        success: false,
        title: 'Помилка видалення',
        description: 'Ви не можете видалити самого себе',
      };

    const doExist = await this.getEmployee(id);
    if (!doExist)
      return {
        success: false,
        title: 'Помилка видалення',
        description: 'Такого працівника не існує',
      };
    if (
      req.currentEmployee.employee_role === 1 &&
      (doExist.employee_role === 1 || doExist.employee_role === 2)
    )
      return {
        success: false,
        title: 'Помилка видалення',
        description: 'Недостатньо прав для видалення працівника',
      };

    try {
      await this.databaseService.query(`
        DELETE FROM Employee
        WHERE employee_id = '${id}';
      `);
    } catch (error) {
      return {
        success: false,
        title: 'Помилка видалення',
        description: 'Видалення порушує цілісність бази даних',
      };
    }

    return {
      success: true,
      title: 'Видалення успішне',
      description: `Працівник ${id} був видалений`,
    };
  }
}
