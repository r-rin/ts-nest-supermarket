import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Injectable()
export class ApiService {
  constructor(private databaseService: DatabaseService) {}

  async getAllRoles() {
    const queryResult = await this.databaseService.query(
      `SELECT *
      FROM Role;`
    );

    const rolesDict = {};

    queryResult.forEach(role => {
      rolesDict[role.role_id] = role.role_title;
    });

    return rolesDict;
  }
}
