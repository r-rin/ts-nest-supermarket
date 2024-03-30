import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DatabaseService {
  private connection: mysql.Connection;

  constructor() {
    this.connect();
  }

  async connect() {
    this.connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  async query(sql: string, params?: any[]) {
    try {
      const [rows, fields] = await this.connection.execute(sql, params);
      return [rows, fields];
    } catch (error) {
      console.error('MySQL Query Error:', error);
      throw error;
    }
  }

  async close() {
    await this.connection.end();
  }
}
