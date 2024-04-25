import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

function filterQueryBuilder(
  upc: string,
  text: string,
  type: string,
  sortBy: string,
  order: string,
  limit: any,
  page: any,
): string {
  if (!upc) upc = '';
  if (!text) {
    text = '';
  } else {
    // I'm not sure if this is safe...
    // Hope no one will pass SQL injections into text...
    text = decodeURIComponent(text);
  }

  let queryBase = `
    SELECT *
    FROM Store_Product
    JOIN Product ON Store_Product.product_id = Product.product_id
    WHERE (
        UPC LIKE '%${upc}%'
        OR COALESCE(UPC_prom, '') LIKE '%${upc}%'
    ) 
    AND ( 
        Product.product_name LIKE '%${text}%'
    )`;

  if (type && type != 'all')
    queryBase += ` AND is_promotional = ${type == 'promotional' ? 'TRUE' : 'FALSE'}`;
  if (sortBy && sortBy != 'none') queryBase += ` ORDER BY ${sortBy} ${order}`;
  if (limit) queryBase += ` LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
  queryBase += ';';

  return queryBase;
}

@Injectable()
export class SuppliesService {
  constructor(private databaseService: DatabaseService) {}

  async getAllSupplies(limit, page) {
    const response_data = {
      rows: [],
      amount: undefined,
    };

    response_data.rows = await this.databaseService.query(
      `SELECT * 
      FROM Store_Product
      LIMIT ${limit} OFFSET ${(page - 1) * limit};`,
    );

    const amount = await this.databaseService.query(
      `SELECT COUNT(UPC)
       FROM Store_Product;`,
    );

    response_data.amount = amount[0]['COUNT(UPC)'];

    return response_data;
  }

  findByUPC(upcToFind: string) {
    return this.databaseService.query(
      `SELECT * 
      FROM Store_Product
      WHERE UPC='${upcToFind}';`,
    );
  }

  async searchByFilter(
    upc: string,
    text: string,
    type: string,
    sortBy: string,
    order: string,
    limit: any,
    page: any,
  ) {
    const query = filterQueryBuilder(
      upc,
      text,
      type,
      sortBy,
      order,
      limit,
      page,
    );
    const allQuery = filterQueryBuilder(
      upc,
      text,
      type,
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
