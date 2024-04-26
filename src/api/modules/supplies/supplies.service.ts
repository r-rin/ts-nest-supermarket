import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { IResponseInterface } from '../../interfaces/IResponse.interface';
import { AddSupplyDTO } from '../../dto/add-supply.dto';
import { EditSupplyDTO } from '../../dto/edit-supply.dto';
import { CreatePromotionalSupplyDTO } from '../../dto/create-promotional.dto';

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

  async findByUPCDataRaw(upcToFind: string) {
    let queryResult =  await this.databaseService.query(
      `SELECT * 
      FROM Store_Product
      INNER JOIN Product P ON Store_Product.product_id = P.product_id
      WHERE UPC='${upcToFind}';`,
    );

    if (queryResult.length === 0) return null;

    return queryResult[0];
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

  async editSupply(editSupplyDTO: EditSupplyDTO) {
    const doExists = await this.findByUPC(
      editSupplyDTO.UPC
    );

    if (doExists == null) return {
      success: false,
      title: 'Неможливо редагувати товар',
      description: `Товару з UPC ${editSupplyDTO.UPC} не існує`,
    };

    let manDate = new Date(editSupplyDTO.manufacturing_date);
    let expDate = new Date(editSupplyDTO.expiration_date);

    if (manDate >= expDate) {
      return {
        success: false,
        title: 'Хибні дані товару',
        description: `Дата виготовлення товару більша або рівна терміну придатності`,
      };
    }

    if (doExists.is_promotional) {
      let oldAmount = doExists.products_amount;
      let newAmount = editSupplyDTO.products_amount;
      let difference = newAmount - oldAmount;

      let nonPromSupply = await this.databaseService.query(`
        SELECT *
        FROM Store_Product
        WHERE UPC_prom = '${doExists.UPC}'
      `)

      if (nonPromSupply.length != 0) {
        let supply = nonPromSupply[0];
        if (supply.products_amount - difference < 0) {
          return {
            success: false,
            title: 'Порушення цілісності',
            description: `
              Існує не акційний товар ${supply.UPC} повʼязаний з цим, який має менше продуктів, ніж ви намагаєтесь зробити акційними.
              Доступна кількість ${supply.products_amount}, а різниця між новим і старим значенням ${difference}`,
          }
        } else {

          try {
            await this.databaseService.query(`
              UPDATE Store_Product
              SET products_amount = ${supply.products_amount - difference},
                  product_id = ${editSupplyDTO.product_id}
              WHERE UPC = '${supply.UPC}';
            `)
          } catch (error) {
            return {
              success: false,
              title: 'Погана спроба збереження цілісності',
              description: `
                При спробі оновлення кількості не акційного товару виникла помилка 
              `,
            };
          }

        }
      }

    } else {
      if (doExists.UPC_prom != null) {
        let supply_prom = await this.findByUPC(doExists.UPC_prom);

        try {
          await this.databaseService.query(`
            UPDATE Store_Product
            SET product_id = ${editSupplyDTO.product_id}
            WHERE UPC = '${supply_prom.UPC}';
        `)
        } catch (error) {
          return {
            success: false,
            title: 'Погана спроба збереження цілісності',
            description: `
                При спробі оновлення інформації повʼязаного акційного товару виникла помилка 
              `,
          };
        }
      }

    }

    try {
      await this.databaseService.query(`
          UPDATE Store_Product
          SET product_id = ${editSupplyDTO.product_id}, 
              selling_price = ${editSupplyDTO.selling_price}, 
              products_amount = ${editSupplyDTO.products_amount},
              manufacturing_date = '${editSupplyDTO.manufacturing_date.toISOString().slice(0, 19).replace('T', ' ')}', 
              expiration_date = '${editSupplyDTO.expiration_date.toISOString().slice(0, 19).replace('T', ' ')}'
          WHERE UPC = '${editSupplyDTO.UPC}';
      `);
    } catch(error) {
      return {
        success: false,
        title: 'Помилка при оновленні товару',
        description: `При виконанні запиту виникла помилка`,
      };
    }

    return {
      success: true,
      title: 'Інформацію про товар змінено',
      description: `Інформація про товар з UPC ${editSupplyDTO.UPC} була змінена`,
    };
  }

  async createPromotionalSupply(createPromotionalSupplyDTO: CreatePromotionalSupplyDTO) {
    let doExist = await this.findByUPC(createPromotionalSupplyDTO.UPC_prom);

    if (doExist) return {
      success: false,
      title: 'Неможливо створити акційний товар',
      description: `Товар з UPC ${createPromotionalSupplyDTO.UPC_prom} вже існує`,
    };

    let nonPromSupply = await this.findByUPCDataRaw(createPromotionalSupplyDTO.UPC);

    if (nonPromSupply == null) return {
      success: false,
      title: 'Неможливо створити акційний товар',
      description: `Неакційний товар, для якого створюється акційний, не існує`,
    };

    if (nonPromSupply.UPC_prom != null) return {
      success: false,
      title: 'Неможливо створити акційний товар',
      description: `Неакційний товар, для якого створюється акційний, вже має акційний відповідник`,
    };

    try {
      await this.databaseService.query(`
          INSERT INTO Store_Product (UPC, UPC_prom, product_id, selling_price, products_amount, is_promotional, manufacturing_date, expiration_date)
          VALUES (
                  '${createPromotionalSupplyDTO.UPC_prom}', 
                  NULL,
                  ${nonPromSupply.product_id}, 
                  ${nonPromSupply.selling_price * 0.8}, 
                  0, 
                  TRUE, 
                  '${nonPromSupply.manufacturing_date.toISOString().slice(0, 19).replace('T', ' ')}', 
                  '${nonPromSupply.expiration_date.toISOString().slice(0, 19).replace('T', ' ')}');
      `);
    } catch(error) {
      console.log("Error at creating promotional")
      return {
        success: false,
        title: 'Неможливо створити акційний товар',
        description: `При виконанні запиту виникла помилка`,
      };
    }

    try {
      await this.databaseService.query(`
          UPDATE Store_Product
          SET UPC_prom = '${createPromotionalSupplyDTO.UPC_prom}'
          WHERE UPC = '${createPromotionalSupplyDTO.UPC}'
      `);
    } catch(error) {
      console.log("Error at assigning promotional")
      return {
        success: false,
        title: 'Неможливо створити акційний товар',
        description: `При виконанні запиту виникла помилка`,
      };
    }

    return {
      success: true,
      title: 'Акційний товар створено',
      description: `Створено акційний товар з UPC ${createPromotionalSupplyDTO.UPC_prom} для неакційного товару з UPC ${createPromotionalSupplyDTO.UPC}`,
    };
  }
}
