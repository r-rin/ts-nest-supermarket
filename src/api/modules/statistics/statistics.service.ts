import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class StatisticsService {
  constructor(private databaseService: DatabaseService) {}

  async getTotalAmountOfProductsByCashierAndDateRange(
    cashierId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const query = `
        SELECT SUM(Receipt.sum_total) AS total_amount_of_products
        FROM Receipt
        WHERE Receipt.employee_id = ?
          AND Receipt.print_date >= ?
            AND Receipt.print_date <= ?
    `;
    const result = await this.databaseService.query(query, [
      cashierId,
      startDate,
      endDate,
    ]);
    return result[0].total_amount_of_products || 0;
  }

  async getTotalAmountOfProductsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const query = `
      SELECT SUM(Receipt.sum_total) AS total_amount_of_products
      FROM Receipt
      WHERE Receipt.print_date >= ?
        AND Receipt.print_date <= ?;
    `;
    const result = await this.databaseService.query(query, [
      startDate,
      endDate,
    ]);
    return result[0].total_amount_of_products || 0;  }
}
