import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

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
}
