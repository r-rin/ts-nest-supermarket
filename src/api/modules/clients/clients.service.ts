import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

function filterQueryBuilder(
  id: string,
  text: string,
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
    FROM Customer_Card
    WHERE card_number LIKE '%${id}%'
    AND (
        customer_name LIKE '%${text}%'
        OR customer_surname LIKE '%${text}%'
        OR COALESCE(customer_patronymic, '') LIKE '%${text}%'
        OR customer_phone_number LIKE '%${text}%'
        OR COALESCE(customer_city, '') LIKE '%${text}%'
        OR COALESCE(customer_street, '') LIKE '%${text}%'
        OR COALESCE(customer_zip_code, '') LIKE '%${text}%'
    )`;

  if (sortBy && sortBy != 'none') queryBase += ` ORDER BY ${sortBy} ${order}`;
  if (limit) queryBase += ` LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
  queryBase += ';';

  return queryBase;
}

@Injectable()
export class ClientsService {
  constructor(private databaseService: DatabaseService) {}
  async getAllClients(limit, page) {
    const response_data = {
      rows: [],
      amount: undefined,
    };

    response_data.rows = await this.databaseService.query(
      `SELECT * 
      FROM Customer_Card
      LIMIT ${limit} OFFSET ${(page - 1) * limit};`,
    );

    const amount = await this.databaseService.query(
      `SELECT COUNT(card_number)
       FROM Customer_Card;`,
    );

    response_data.amount = amount[0]['COUNT(card_number)'];

    return response_data;
  }

  findClientByPIB(
    customerName: string,
    customerSurname: string,
    customerPatronymic: string,
  ) {
    return this.databaseService.query(
      `SELECT * 
      FROM Customer_card
      WHERE customer_name LIKE '%${customerName}%'
        AND customer_surname  LIKE '%${customerSurname}%'
        AND customer_patronymic LIKE '%${customerPatronymic}%';`,
    );
  }

  async getClientCard(card_id) {
    const queryResult = await this.databaseService.query(
      `SELECT *
      FROM Customer_Card
      WHERE card_number = '${card_id}'`,
    );

    if (queryResult.length === 0) return null;

    return queryResult[0];
  }

  async searchByFilter(
    id: string,
    text: string,
    sortBy: string,
    order: string,
    limit: any,
    page: any,
  ) {
    const query = filterQueryBuilder(id, text, sortBy, order, limit, page);
    const allQuery = filterQueryBuilder(id, text, sortBy, order, null, null);
    const queryResult = await this.databaseService.query(query);
    const allQueryResult = await this.databaseService.query(allQuery);

    return {
      rows: queryResult,
      amount: allQueryResult.length,
    };
  }
}
