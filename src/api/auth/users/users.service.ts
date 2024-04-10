import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { IEmployeeAuth } from '../../interfaces/IEmployeeAuth.interface';
import * as mysql2 from 'mysql2';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async findOne(employee_id: string): Promise<IEmployeeAuth | null> {
    const query_result: mysql2.RowDataPacket[] =
      await this.databaseService.query(
        `SELECT * 
        FROM Auth_data 
        WHERE employee_id='${employee_id}';`,
      );

    if (!query_result || query_result.length == 0) return null;

    return {
      employee_id: query_result[0].employee_id,
      password_hash: query_result[0].password_hash,
    };
  }

  async getRole(employee_id: string): Promise<number | null> {
    const queryResult: mysql2.RowDataPacket[] =
      await this.databaseService.query(
        `SELECT employee_role
        FROM Employee
        WHERE employee_id='${employee_id}'`,
      );

    if (queryResult.length == 0) return null;

    return Number(queryResult[0].employee_role);
  }
}
