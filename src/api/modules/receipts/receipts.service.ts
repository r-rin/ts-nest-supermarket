import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateReceiptDTO } from '../../dto/create-receipt.dto';
import { SuppliesService } from '../supplies/supplies.service';
import { ClientsService } from '../clients/clients.service';

function filterQueryBuilder(
  receipt_id: string,
  text: string,
  employee_id: string,
  date_start: string,
  date_end: string,
  sortBy: string,
  order: string,
  limit: any,
  page: any,
) {
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
      Customer_Card.customer_percent,
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

  if (date_start.length != 0 && date_end.length != 0)
    queryBase += ` AND (Receipt.print_date >= DATE('${date_start}') AND Receipt.print_date <= DATE_ADD(DATE('${date_end}'), INTERVAL 1 DAY) - INTERVAL 1 SECOND)`;

  queryBase += ' GROUP BY Receipt.receipt_id';
  queryBase += ` HAVING (customer_fullname LIKE '%${text}%'
                OR employee_fullname LIKE '%${text}%'
                OR JSON_SEARCH(product_name_list, 'one', '%${text}%', NULL, '$[*]') IS NOT NULL)`;
  if (sortBy && sortBy != 'none') queryBase += ` ORDER BY ${sortBy} ${order}`;
  if (limit) queryBase += ` LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
  queryBase += ';';

  return queryBase;
}

@Injectable()
export class ReceiptsService {
  constructor(private databaseService: DatabaseService,
              private suppliesService: SuppliesService,
              private clientsService:ClientsService) {}

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

  async findByReceiptID(receiptIDToFind: string) {
    const queryResult = await this.databaseService.query(`
        SELECT
          Receipt.receipt_id,
          Receipt.employee_id,
          Receipt.card_number,
          Receipt.print_date,
          Receipt.sum_total,
          Customer_Card.customer_percent,
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
          Receipt.receipt_id = '${receiptIDToFind}'
        GROUP BY 
          Receipt.receipt_id
      `);

    if (queryResult.length == 0) return null;

    const tempDate = new Date(queryResult[0].print_date);
    queryResult[0].print_date = `${tempDate.toLocaleDateString('en-GB')} ${tempDate.toLocaleTimeString('en-GB')}`;

    return queryResult[0];
  }

  async searchByFilter(
    receipt_id,
    text,
    employee_id,
    date_start,
    date_end,
    sortBy,
    order,
    limit,
    page,
  ) {
    const query = filterQueryBuilder(
      receipt_id,
      text,
      employee_id,
      date_start,
      date_end,
      sortBy,
      order,
      limit,
      page,
    );
    const allQuery = filterQueryBuilder(
      receipt_id,
      text,
      employee_id,
      date_start,
      date_end,
      sortBy,
      order,
      null,
      null,
    );

    const queryResult = await this.databaseService.query(query);
    const allQueryResult = await this.databaseService.query(allQuery);

    if (queryResult.length !== 0) {
      queryResult.forEach((result) => {
        const tempDate = new Date(result.print_date);
        result.print_date = `${tempDate.toLocaleDateString('en-GB')} ${tempDate.toLocaleTimeString('en-GB')}`;
      });
    }

    return {
      rows: queryResult,
      amount: allQueryResult.length,
    };
  }

  async deleteReceipt(id) {
    let doExist = await this.findByReceiptID(id);

    if(!doExist) return {
      success: false,
      title: 'Чек не існує',
      description: `Чек неможливо видалити, оскільки його вже не існує`,
    };

    try {
      await this.databaseService.query(`
        DELETE FROM Receipt
        WHERE receipt_id = '${id}';
      `)
    } catch (e) {
      return {
        success: false,
        title: 'Виникла помилка',
        description: `При видаленні чкеу виникла помилка`,
      };
    }

    return {
      success: true,
      title: 'Чек видалено',
      description: `Чек було успішно видалено`,
    };
  }

  async createReceipt(createReceiptDTO: CreateReceiptDTO) {

    let sumTotal = 0;

    for (const [key, value] of Object.entries(createReceiptDTO.checkout)) {
      let queryResult = await this.suppliesService.findByUPC(key);

      if(!queryResult) {
        return {
          success: false,
          title: 'Виникла помилка',
          description: `Товар містить позиції, які не існують або були видалені: ${key}`,
        };
      }

      if(queryResult.products_amount < value) {
        return {
          success: false,
          title: 'Виникла помилка',
          description: `Товар ${queryResult.product_name} (${queryResult.product_id}) має меншу кількість, ніж ви намагаєтесь придбати: максимум ${queryResult.products_amount}`,
        };
      }
    }

    try {
      await this.databaseService.query(`
        INSERT INTO Receipt (receipt_id, employee_id, card_number, print_date, sum_total) 
        VALUES (
                '${createReceiptDTO.receipt_id}',
                '${createReceiptDTO.employee_id}',
                '${createReceiptDTO.card_number}',
                '${new Date().toISOString().slice(0, 10)}',
                ${sumTotal}
               )
      `)
    } catch (e) {
      return {
        success: false,
        title: 'Виникла помилка',
        description: `При створенні чеку виникла помилка`,
      };
    }

    for (const [key, value] of Object.entries(createReceiptDTO.checkout)) {
      let queryResult = await this.suppliesService.findByUPC(key);

      try {
        await this.databaseService.query(`
          UPDATE Store_Product
          SET products_amount = ${queryResult.products_amount - Number(value)}
          WHERE UPC = '${queryResult.UPC}';
        `)
      } catch (e) {
        return {
          success: false,
          title: 'Виникла помилка',
          description: `При оновленні кількості продуктів виникла помилка`,
        };
      }

      try {
        await this.databaseService.query(`
            INSERT INTO Sale (UPC, receipt_id, products_amount, selling_price)
            VALUES ('${queryResult.UPC}',
                    '${createReceiptDTO.receipt_id}',
                    ${value},
                    ${queryResult.selling_price});
        `)
      } catch (e) {
        return {
          success: false,
          title: 'Виникла помилка',
          description: `При реєстрації факту продажі виникла помилка`,
        };
      }

      sumTotal += queryResult.selling_price * Number(value);
    }

    let client = await this.clientsService.getClientCard(createReceiptDTO.card_number);
    sumTotal = sumTotal * ((100 - client.customer_percent) / 100.0)

    try {
      await this.databaseService.query(`
        UPDATE Receipt
        SET sum_total = ${sumTotal}
        WHERE receipt_id = '${createReceiptDTO.receipt_id}';
      `)
    } catch (e) {
      return {
        success: false,
        title: 'Виникла помилка',
        description: `При реєстрації факту продажі виникла помилка`,
      };
    }

    return {
      success: true,
      title: 'Чек створено',
      description: `Чек було успішно створено з ID ${createReceiptDTO.receipt_id}`,
    };
  }
}
