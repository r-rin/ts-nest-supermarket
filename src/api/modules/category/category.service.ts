import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class CategoryService {
  constructor(private databaseService: DatabaseService) {}

  async getAllCategories(limit, page) {
    const response_data = {
      rows: [],
      amount: undefined,
    };

    response_data.rows = await this.databaseService.query(
      `SELECT * 
      FROM Category
      LIMIT ${limit} OFFSET ${(page - 1) * limit};`,
    );

    const amount = await this.databaseService.query(
      `SELECT COUNT(category_name)
       FROM Category;`,
    );

    response_data.amount = amount[0]['COUNT(category_name)'];

    return response_data;
  }

  findByName(categoryNameToFind: string) {
    return this.databaseService.query(
      `SELECT * 
      FROM Category
      WHERE category_name LIKE '%${categoryNameToFind}%';`,
    );
  }
}
