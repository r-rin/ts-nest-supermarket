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

  async getTotalUnitsSoldForProductInPeriod(
    productID: string,
    startDate: string,
    endDate: string,
  ) {
    let query = `
        SELECT SUM(Sale.products_amount) AS total_units_sold
        FROM ((Sale
            INNER JOIN Receipt ON Receipt.receipt_id = Sale.receipt_id)
            INNER JOIN Store_Product ON Sale.UPC = Store_Product.UPC)
        WHERE Store_Product.product_id = '${productID}'`;
    if (startDate.length > 0 && endDate.length > 0) {
      query += `WHERE Receipt.print_date >= DATE('${startDate}')`;
      query += `AND Receipt.print_date < DATE_ADD(DATE('${endDate}'), INTERVAL 1 DAY) - INTERVAL 1 SECOND`;
    }
    const queryResult = await this.databaseService.query(query);
    return queryResult;
  }

  async getTotalAmountOfGoodsInEachCategory(receiptNumber: string) {
    const query = `
      SELECT
    Receipt.receipt_id, Category.category_name,
    SUM(Sale.products_amount) AS TotalProducts
FROM ((((Receipt
    INNER JOIN Sale ON Receipt.receipt_id = Sale.receipt_id)
    INNER JOIN Store_Product ON Sale.UPC = Store_Product.UPC)
    INNER JOIN Product ON Store_Product.product_id = Product.product_id)
    INNER JOIN Category ON Product.category_number = Category.category_number)
WHERE
    Receipt.receipt_id = '${receiptNumber}'
GROUP BY
    Category.category_name;
      `;
    const queryResult = await this.databaseService.query(query);
    return queryResult;
  }

  async getTotalSalesPerCategoryForPeriod(startDate: string, endDate: string) {
    let query = `
        SELECT
            Category.category_name,
            SUM(Sale.selling_price * Sale.products_amount) AS TotalSales
        FROM ((((Category
            INNER JOIN Product ON Category.category_number = Product.category_number)
            INNER JOIN Store_Product ON Product.product_id = Store_Product.product_id)
            INNER JOIN Sale ON Store_Product.UPC = Sale.UPC)
            INNER JOIN Receipt ON Sale.receipt_id = Receipt.receipt_id)`;
    if (startDate.length > 0 && endDate.length > 0) {
      query += `WHERE Receipt.print_date >= DATE('${startDate}')`;
      query += `AND Receipt.print_date < DATE_ADD(DATE('${endDate}'), INTERVAL 1 DAY) - INTERVAL 1 SECOND`;
    }
    query += `
        GROUP BY Category.category_name;
      `;
    const queryResult = await this.databaseService.query(query);
    return queryResult;
  }

  async getSalesCountPerItemPerEmployee() {
    const query = `
        SELECT
            Employee.employee_id,
            Employee.employee_surname,
            Employee.employee_name,
            Product.product_name,
            COUNT(Sale.receipt_id) AS TotalSalesCount
        FROM ((((Employee
            LEFT JOIN Receipt ON Employee.employee_id = Receipt.employee_id)
            LEFT JOIN Sale ON Receipt.receipt_id = Sale.receipt_id)
            LEFT JOIN Store_Product ON Sale.UPC = Store_Product.UPC)
            LEFT JOIN Product ON Store_Product.product_id = Product.product_id)
        WHERE Employee.employee_role = 0
        GROUP BY
            Employee.employee_id,
            Employee.employee_surname,
            Employee.employee_name,
            Product.product_name
        ORDER BY
            Employee.employee_surname, Product.product_name;
      `;
    const queryResult = await this.databaseService.query(query);
    return queryResult;
  }
}
