import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePromotionalSupplyDTO {
  @MaxLength(12)
  UPC: string

  @MaxLength(12)
  UPC_prom: string

  @IsDate()
  @Type(() => Date)
  manufacturing_date: Date

  @IsDate()
  @Type(() => Date)
  expiration_date: Date
}