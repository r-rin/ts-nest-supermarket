import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class ReceiptsService {
  constructor(private databaseService: DatabaseService) {}

  async getAllReceipts(limit, page) {
    const response_data = {
      rows: [],
      amount: undefined,
    };

    response_data.rows = await this.databaseService.query(
      `SELECT * 
      FROM Receipt
      LIMIT ${limit} OFFSET ${(page - 1) * limit};`,
    );

    const amount = await this.databaseService.query(
      `SELECT COUNT(receipt_id)
       FROM Receipt;`,
    );

    response_data.amount = amount[0]['COUNT(receipt_id)'];

    return response_data;
  }

  findByReceiptID(receiptIDToFind: string) {
    return this.databaseService.query(
      `SELECT * 
      FROM Receipt
      WHERE receipt_id LIKE '%${receiptIDToFind}%';`,
    );
  }
}
