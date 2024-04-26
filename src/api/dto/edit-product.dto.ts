import { IsNumber, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class EditProductDTO {
  @IsNumber()
  @Type(() => Number)
  product_id: number;

  @IsNumber()
  @Type(() => Number)
  category_number: number;

  @MaxLength(50)
  product_name: string;

  @MaxLength(50)
  characteristics: string;
}
