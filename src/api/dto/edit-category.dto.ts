import { IsNumber, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
export class EditCategoryDTO {
  @IsNumber()
  @Type(() => Number)
  category_number: number;

  @MaxLength(50)
  category_name: string;
}