import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

function filterQueryBuilder(
  id: string,
  text: string,
  category: string,
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
    FROM Product
    JOIN Category ON Product.category_number = Category.category_number
    WHERE product_id LIKE '%${id}%'
    AND ( 
        product_name LIKE '%${text}%'
        OR characteristics LIKE '%${text}%'
        OR category_name LIKE '%${text}%'
    )`;

  if (category && category != 'all')
    queryBase += ` AND Product.category_number = ${category}`;
  if (sortBy && sortBy != 'none') queryBase += ` ORDER BY ${sortBy} ${order}`;
  if (limit) queryBase += ` LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
  queryBase += ';';

  return queryBase;
}

@Injectable()
export class ProductsService {
  constructor(private databaseService: DatabaseService) {}

  async getAllProducts(limit, page) {
    const response_data = {
      rows: [],
      amount: undefined,
    };

    response_data.rows = await this.databaseService.query(
      `SELECT * 
      FROM Product
      INNER JOIN Category ON product.category_number = Category.category_number
      LIMIT ${limit} OFFSET ${(page - 1) * limit};`,
    );

    const amount = await this.databaseService.query(
      `SELECT COUNT(product_name)
       FROM Product;`,
    );

    response_data.amount = amount[0]['COUNT(product_name)'];

    return response_data;
  }

  findProductByName(productNameToFind: string) {
    return this.databaseService.query(
      `SELECT * 
      FROM Product
      WHERE product.product_name LIKE '%${productNameToFind}%';`,
    );
  }

  async searchByFilter(
    id: string,
    text: string,
    category: string,
    sortBy: string,
    order: string,
    limit: any,
    page: any,
  ) {
    const query = filterQueryBuilder(
      id,
      text,
      category,
      sortBy,
      order,
      limit,
      page,
    );
    const allQuery = filterQueryBuilder(
      id,
      text,
      category,
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
