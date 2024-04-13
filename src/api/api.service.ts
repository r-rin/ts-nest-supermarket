import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { IEmployee } from './interfaces/IEmployee.interface';

@Injectable()
export class ApiService {
  constructor(private databaseService: DatabaseService) {}

}
