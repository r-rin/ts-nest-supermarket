import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Injectable()
export class ApiService {
  constructor(private databaseService: DatabaseService) {}
}
