import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { AddClientDTO } from '../../dto/add-client.dto';

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

  async addNewClient(addClientDTO: AddClientDTO) {
    let doExist = await this.getClientCard(addClientDTO.card_number);

    if (doExist) return {
      success: false,
      title: 'Виникла помилка',
      description: `Клієнт ${addClientDTO.customer_surname} ${addClientDTO.customer_name} з ID ${addClientDTO.card_number} вже існує`,
    };

    try {
      await this.databaseService.query(`
        INSERT INTO Customer_Card (card_number, customer_surname, customer_name, customer_patronymic, customer_phone_number,
                                customer_city, customer_street, customer_zip_code, customer_percent)
        VALUES (
                '${addClientDTO.card_number}', 
                '${addClientDTO.customer_surname}', 
                '${addClientDTO.customer_name}', 
                ${addClientDTO.customer_patronymic ? "'" + addClientDTO.customer_patronymic + "'" : 'NULL' }, 
                '${addClientDTO.customer_phone_number}',
                ${addClientDTO.customer_city ? "'" + addClientDTO.customer_city + "'" : 'NULL' },
                ${addClientDTO.customer_street ? "'" + addClientDTO.customer_street + "'" : 'NULL' },
                ${addClientDTO.customer_zip_code ? "'" + addClientDTO.customer_zip_code + "'" : 'NULL' }, 
                ${addClientDTO.customer_percent});
      `)
    } catch (error) {
      return {
        success: false,
        title: 'Виникла помилка',
        description: `При виконанні запиту виникла помилка`,
      };
    }

    return {
      success: true,
      title: 'Клієнта створено',
      description: `Клієнт ${addClientDTO.customer_surname} ${addClientDTO.customer_name} з ID ${addClientDTO.card_number} був створений`,
    };
  }
}
