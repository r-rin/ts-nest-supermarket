import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

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
}
