import { IsNumber, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReceiptDTO {
  @MaxLength(10)
  employee_id: string;

  @MaxLength(10)
  receipt_id: string;

  @MaxLength(12)
  card_number: number

  checkout: any;
}