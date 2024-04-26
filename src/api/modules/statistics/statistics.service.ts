import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

function queryBuilder(
  employee_id: string,
  start_date: string,
  end_date: string,
) {
  let queryBase = `
    SELECT SUM(Receipt.sum_total) AS total_amount_of_products
    FROM Receipt
  `;

  if (employee_id != 'all') {
    queryBase += ` WHERE Receipt.employee_id = '${employee_id}'`;
    if (start_date.length > 0 && end_date.length > 0) {
      queryBase += ` AND Receipt.print_date >= DATE('${start_date}')`;
      queryBase += ` AND Receipt.print_date <= DATE_ADD(DATE('${end_date}'), INTERVAL 1 DAY) - INTERVAL 1 SECOND`;
    }
  } else {
    if (start_date.length > 0 && end_date.length > 0) {
      queryBase += ` WHERE Receipt.print_date >= DATE('${start_date}')`;
      queryBase += ` AND Receipt.print_date <= DATE_ADD(DATE('${end_date}'), INTERVAL 1 DAY) - INTERVAL 1 SECOND`;
    }
  }
  queryBase += ';';

  return queryBase;
}

@Injectable()
export class StatisticsService {
  constructor(private databaseService: DatabaseService) {}

  async getAllReceiptsSum(
    employee_id: string,
    start_date: string,
    end_date: string,
  ) {
    const query = queryBuilder(employee_id, start_date, end_date);
    const queryResult = await this.databaseService.query(query);

    console.log(queryResult);

    if (queryResult[0].total_amount_of_products == null) return 0;

    return queryResult[0].total_amount_of_products;
  }
}
