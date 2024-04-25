import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

function filterQueryBuilder(
  id: string,
  text: string,
  sortBy: string,
  order: string,
  limit: any,
  page: any,
): string {
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
    FROM Category
    WHERE category_number LIKE '%${id}%'
    AND (
        category_name LIKE '%${text}%'
    )`;

  if (sortBy && sortBy != 'none') queryBase += ` ORDER BY ${sortBy} ${order}`;
  if (limit) queryBase += ` LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
  queryBase += ';';

  return queryBase;
}

@Injectable()
export class CategoriesService {
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

  async getAllCategoriesDict() {
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

  async searchByFilter(
    id: string,
    text: string,
    sortBy: string,
    order: string,
    limit: any,
    page: any,
  ) {
    const query = filterQueryBuilder(
      id,
      text,
      sortBy,
      order,
      limit,
      page,
    );
    const allQuery = filterQueryBuilder(
      id,
      text,
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
}
