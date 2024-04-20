import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

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
      WHERE UPC LIKE '%${upcToFind}%';`,
    );
  }
}
