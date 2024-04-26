import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { IResponseInterface } from '../../interfaces/IResponse.interface';
import { AddSupplyDTO } from '../../dto/add-supply.dto';

function filterQueryBuilder(
  upc: string,
  text: string,
  type: string,
  sortBy: string,
  order: string,
  limit: any,
  page: any,
): string {
  if (!upc) upc = '';
  if (!text) {
    text = '';
  } else {
    // I'm not sure if this is safe...
    // Hope no one will pass SQL injections into text...
    text = decodeURIComponent(text);
  }

  let queryBase = `
    SELECT *
    FROM Store_Product
    JOIN Product ON Store_Product.product_id = Product.product_id
    WHERE (
        UPC LIKE '%${upc}%'
        OR COALESCE(UPC_prom, '') LIKE '%${upc}%'
    ) 
    AND ( 
        Product.product_name LIKE '%${text}%'
    )`;

  if (type && type != 'all')
    queryBase += ` AND is_promotional = ${type == 'promotional' ? 'TRUE' : 'FALSE'}`;
  if (sortBy && sortBy != 'none') queryBase += ` ORDER BY ${sortBy} ${order}`;
  if (limit) queryBase += ` LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
  queryBase += ';';

  return queryBase;
}

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

  async findByUPC(upcToFind: string) {
    let queryResult =  await this.databaseService.query(
      `SELECT * 
      FROM Store_Product
      INNER JOIN Product P ON Store_Product.product_id = P.product_id
      WHERE UPC='${upcToFind}';`,
    );

    if (queryResult.length === 0) return null;

    queryResult[0].manufacturing_date = new Date(queryResult[0].manufacturing_date)
      .toLocaleDateString('en-GB');
    queryResult[0].expiration_date = new Date(queryResult[0].expiration_date)
      .toLocaleDateString('en-GB');

    return queryResult[0];
  }

  async searchByFilter(
    upc: string,
    text: string,
    type: string,
    sortBy: string,
    order: string,
    limit: any,
    page: any,
  ) {
    const query = filterQueryBuilder(
      upc,
      text,
      type,
      sortBy,
      order,
      limit,
      page,
    );
    const allQuery = filterQueryBuilder(
      upc,
      text,
      type,
      sortBy,
      order,
      null,
      null,
    );
    const queryResult = await this.databaseService.query(query);
    const allQueryResult = await this.databaseService.query(allQuery);

    return {
      rows: queryResult,
      amount: allQueryResult.length,
    };
  }

  async addNewSupply(addSupplyDTO: AddSupplyDTO): Promise<IResponseInterface> {
    const doExists = await this.findByUPC(
      addSupplyDTO.UPC
    );

    if (doExists) return {
      success: false,
      title: 'Неможливо створити товар',
      description: `Товар з UPC ${addSupplyDTO.UPC} вже існує`,
    };

    let manDate = new Date(addSupplyDTO.manufacturing_date);
    let expDate = new Date(addSupplyDTO.expiration_date);
    if (manDate >= expDate) {
      return {
        success: false,
        title: 'Хибні дані товару',
        description: `Дата виготовлення товару більша або рівна терміну придатності`,
      };
    }

    try {
      this.databaseService.query(`
          INSERT INTO Store_Product (UPC, UPC_prom, product_id, selling_price, products_amount, is_promotional, manufacturing_date, expiration_date)
          VALUES (
                  '${addSupplyDTO.UPC}', 
                  NULL,
                  ${addSupplyDTO.product_id}, 
                  ${addSupplyDTO.selling_price}, 
                  ${addSupplyDTO.products_amount}, 
                  FALSE, 
                  '${addSupplyDTO.manufacturing_date.toISOString().slice(0, 19).replace('T', ' ')}', 
                  '${addSupplyDTO.expiration_date.toISOString().slice(0, 19).replace('T', ' ')}');
      `);
    } catch(error) {
      return {
        success: false,
        title: 'Неможливо створити товар',
        description: `При виконанні запиту виникла помилка`,
      };
    }

    return {
      success: true,
      title: 'Товар створено',
      description: `Товар з ID ${addSupplyDTO.UPC} було створено`,
    };
  }
}
