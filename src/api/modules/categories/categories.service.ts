import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { IResponseInterface } from '../../interfaces/IResponse.interface';
import { ICategory } from '../../interfaces/ICategory.interface';
import { EditCategoryDTO } from '../../dto/edit-category.dto';
import { AddCategoryDTO } from '../../dto/add-category.dto';

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
    FROM Category
    WHERE category_number LIKE '%${id}%'
    AND (
        category_name LIKE '%${text}%'
    )`;

  if (sortBy && sortBy != 'none') queryBase += ` ORDER BY ${sortBy} ${order}`;
  if (limit) queryBase += ` LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
  queryBase += ';';

  return queryBase;
}

@Injectable()
export class CategoriesService {
  constructor(private databaseService: DatabaseService) {}

  async getAllCategories(limit, page) {
    const response_data = {
      rows: [],
      amount: undefined,
    };

    response_data.rows = await this.databaseService.query(
      `SELECT * 
      FROM Category
      LIMIT ${limit} OFFSET ${(page - 1) * limit};`,
    );

    const amount = await this.databaseService.query(
      `SELECT COUNT(category_name)
       FROM Category;`,
    );

    response_data.amount = amount[0]['COUNT(category_name)'];

    return response_data;
  }

  async getCategory(category_number: number): Promise<ICategory> {
    const queryResult = await this.databaseService.query(
      `SELECT * 
      FROM Category
      WHERE category_number = '${category_number}';`,
    );

    if (queryResult.length == 0) return null;

    const categoryData = queryResult[0];
    const category: ICategory = {
      category_number: categoryData.category_number,
      category_name: categoryData.category_name,
    };

    return category;
  }

  findByName(categoryNameToFind: string) {
    return this.databaseService.query(
      `SELECT * 
      FROM Category
      WHERE category_name LIKE '%${categoryNameToFind}%';`,
    );
  }

  async getAllCategoriesArr() {
    const queryResult = await this.databaseService.query(
      `SELECT *
      FROM Category;`,
    );
    return queryResult;
  }
  async getAllCategoriesDict() {
    const queryResult = await this.databaseService.query(
      `SELECT *
      FROM Category;`,
    );

    const categoriesDict = {};
    queryResult.forEach((category) => {
      categoriesDict[category.category_number] = category.category_name;
    });

    return categoriesDict;
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

  async deleteCategory(req, id): Promise<IResponseInterface> {
    const doExist = await this.getCategory(id);
    if (!doExist)
      return {
        success: false,
        title: 'Помилка видалення',
        description: 'Такої категорії не існує',
      };

    try {
      await this.databaseService.query(`
        DELETE FROM Category
        WHERE category_number = '${id}';
      `);
    } catch (error) {
      return {
        success: false,
        title: 'Помилка видалення',
        description: 'Видалення порушує цілісність бази даних',
      };
    }

    return {
      success: true,
      title: 'Видалення успішне',
      description: `Категорія ${id} була видалена`,
    };
  }

  async editCategory(editCategoryDTO: EditCategoryDTO) {
    try {
      this.databaseService.query(`
        UPDATE Category
        SET category_name = '${editCategoryDTO.category_name}'
        WHERE category_number = ${editCategoryDTO.category_number};
      `);
    } catch (error) {
      return {
        success: false,
        title: 'Помилка при редагуванні',
        description: `При виконанні запиту виникла помилка, перевірте введені дані`,
      };
    }

    return {
      success: true,
      title: 'Зміни успішно застосовані',
      description: `Для категорії з ID ${editCategoryDTO.category_number} було застосовано зміни`,
    };
  }

  async addCategory(addCategoryDTO: AddCategoryDTO) {
    const doExists = await this.getCategory(addCategoryDTO.category_number);

    if (doExists)
      return {
        success: false,
        title: 'Неможливо створити категорію',
        description: `Категорія з ID ${addCategoryDTO.category_number} вже існує (${doExists.category_name})`,
      };

    try {
      this.databaseService.query(`
          INSERT INTO Category (category_number, category_name)
          VALUES (
                  ${addCategoryDTO.category_number},
                  '${addCategoryDTO.category_name}');
      `);
    } catch (error) {
      return {
        success: false,
        title: 'Неможливо створити категорію',
        description: `При виконанні запиту виникла помилка`,
      };
    }

    return {
      success: true,
      title: 'Категорію створено',
      description: `Категорію ${addCategoryDTO.category_name} з ID ${addCategoryDTO.category_number} було створено`,
    };
  }
}
