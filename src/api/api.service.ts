import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Injectable()
export class ApiService {
  constructor(private databaseService: DatabaseService) {}

  async getVariableValue(var_name: string) {
    const queryResult = await this.databaseService.query(`
      SELECT *
      FROM Global_Variables
      WHERE variable_name = '${var_name}'
    `);

    if (queryResult.length == 0) return null;

    return queryResult[0];
  }

  async getAllRoles() {
    const queryResult = await this.databaseService.query(
      `SELECT *
      FROM Role;`,
    );

    const rolesDict = {};

    queryResult.forEach((role) => {
      rolesDict[role.role_id] = role.role_title;
    });

    return rolesDict;
  }
}
