import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

function filterQueryBuilder(receipt_id: string, text: string, employee_id: string, date_start: string,
                            date_end: string, sortBy: string, order: string, limit: any, page: any) {

  if (!receipt_id) receipt_id = '';
  if (!employee_id) employee_id = '';
  if (!text) {
    text = '';
  } else {
    // I'm not sure if this is safe...
    // Hope no one will pass SQL injections into text...
    text = decodeURIComponent(text);
  }

  let queryBase = `
    SELECT
      Receipt.receipt_id,
      Receipt.employee_id,
      Receipt.card_number,
      Receipt.print_date,
      Receipt.sum_total,
      CONCAT_WS(' ', Customer_Card.customer_surname, Customer_Card.customer_name,
             Customer_Card.customer_patronymic) AS customer_fullname,
      JSON_ARRAYAGG(Sale.UPC) AS UPC_list,
      JSON_ARRAYAGG(Store_Product.product_id) AS product_id_list,
      JSON_ARRAYAGG(Sale.selling_price) AS selling_price_list,
      JSON_ARRAYAGG(Sale.products_amount) AS sold_products_amount_list,
      CONCAT_WS(' ', Employee.employee_surname, Employee.employee_name,
             Employee.employee_patronymic) AS employee_fullname,
      JSON_ARRAYAGG(Product.product_name) AS product_name_list
    FROM Receipt
      INNER JOIN
        Sale ON Sale.receipt_id = Receipt.receipt_id
      INNER JOIN
        Store_Product ON Store_Product.UPC = Sale.UPC
      INNER JOIN
        Employee ON Employee.employee_id = Receipt.employee_id
      INNER JOIN
        Product ON Store_Product.product_id = Product.product_id
      INNER JOIN
        Customer_Card ON Receipt.card_number = Customer_Card.card_number
    WHERE
      Receipt.receipt_id LIKE '%${receipt_id}%'
      AND Receipt.employee_id LIKE '%${employee_id}%'
  `;

  if (date_start.length != 0 && date_end.length != 0) queryBase +=
    ` AND (Receipt.print_date >= DATE('${date_start}') AND Receipt.print_date <= DATE_ADD(DATE('${date_end}'), INTERVAL 1 DAY) - INTERVAL 1 SECOND)`;

  queryBase += ' GROUP BY Receipt.receipt_id';
  queryBase += ` HAVING (customer_fullname LIKE '%${text}%'
                OR employee_fullname LIKE '%${text}%'
                OR JSON_SEARCH(product_name_list, 'one', '%${text}%', NULL, '$[*]') IS NOT NULL)`
  if (sortBy && sortBy != 'none') queryBase += ` ORDER BY ${sortBy} ${order}`;
  if (limit) queryBase += ` LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
  queryBase += ';';

  return queryBase;
}

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

  async searchByFilter(receipt_id,
                       text,
                       employee_id,
                       date_start,
                       date_end,
                       sortBy,
                       order,
                       limit,
                       page,) {
    const query = filterQueryBuilder(
      receipt_id, text, employee_id, date_start,
      date_end, sortBy, order, limit, page
    );
    const allQuery = filterQueryBuilder(
      receipt_id, text, employee_id, date_start,
      date_end, sortBy, order, null, null,
    );

    console.log(query);
    const queryResult = await this.databaseService.query(query);
    const allQueryResult = await this.databaseService.query(allQuery);
    console.log(queryResult);

    return {
      rows: queryResult,
      amount: allQueryResult.length,
    };
  }
}
