import {
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AddClientDTO {
  @MaxLength(13)
  card_number: string;

  @MaxLength(50)
  customer_name: string;

  @MaxLength(50)
  customer_surname: string;

  @MaxLength(50)
  @IsOptional()
  customer_patronymic: string;

  @IsPhoneNumber('UA')
  @MaxLength(13)
  customer_phone_number: string;

  @MaxLength(50)
  @IsOptional()
  customer_city: string;

  @MaxLength(50)
  @IsOptional()
  customer_street: string;

  @MaxLength(9)
  @IsOptional()
  customer_zip_code: string;

  @IsNumber()
  @Type(() => Number)
  customer_percent: number;
}
