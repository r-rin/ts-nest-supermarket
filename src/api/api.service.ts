import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Injectable()
export class ApiService {
  constructor(private databaseService: DatabaseService) {}

  async getProducts() {
    return await this.databaseService.query('SELECT * FROM Product;');
  }
}
