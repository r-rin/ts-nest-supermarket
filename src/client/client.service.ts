import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientService {
  formatDate(inputDate: string) {
    const date: Date = new Date(inputDate);
    return date.toLocaleDateString('en-GB');
  }
}
