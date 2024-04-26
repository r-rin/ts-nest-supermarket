import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class EditSupplyDTO {
  @MaxLength(12)
  UPC: string;

  @IsNumber()
  @Type(() => Number)
  product_id: number;

  @IsNumber()
  @Type(() => Number)
  selling_price: number;

  @IsNumber()
  @Type(() => Number)
  products_amount: number;

  @IsDate()
  @Type(() => Date)
  manufacturing_date: Date;

  @IsDate()
  @Type(() => Date)
  expiration_date: Date;
}
