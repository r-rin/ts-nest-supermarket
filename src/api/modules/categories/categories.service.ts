import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class CategoriesService {
  constructor(private databaseService: DatabaseService) {}

  async getAllCategories() {
    const queryResult = await this.databaseService.query(
      `SELECT *
      FROM Category;`,
    );

    const categoriesDict = {};
    queryResult.forEach((category) => {
      categoriesDict[category.category_number] = category.category_name;
    });

    return categoriesDict;
  }
}
