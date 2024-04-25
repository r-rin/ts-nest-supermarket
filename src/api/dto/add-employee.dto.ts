import {
  MaxLength,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDate,
  IsPhoneNumber,
  ValidationArguments,
  ValidatorConstraintInterface,
  ValidatorConstraint,
  Validate,
} from 'class-validator';
import { Role } from '../auth/roles/role.enum';
import { Type } from 'class-transformer';

@ValidatorConstraint({ name: 'age', async: false })
export class AgeConstraint implements ValidatorConstraintInterface {
  validate(date: Date, args: ValidationArguments) {
    const currentDate = new Date();
    const eighteenYearsAgo = new Date(
      currentDate.getFullYear() - 18,
      currentDate.getMonth(),
      currentDate.getDate(),
    );
    return date <= eighteenYearsAgo;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Employee must be at least 18 years old.';
  }
}

export class AddEmployeeDTO {
  @MaxLength(10)
  employee_id: string;

  @MaxLength(50)
  employee_name: string;

  @MaxLength(50)
  employee_surname: string;

  @MaxLength(50)
  @IsOptional()
  employee_patronymic: string;

  @IsNumber()
  @Type(() => Number)
  @IsEnum(Role)
  employee_role: number;

  @IsNumber()
  @Type(() => Number)
  employee_salary: number;

  @Type(() => Date)
  @IsDate()
  employee_start_date: Date;

  @Type(() => Date)
  @IsDate()
  @Validate(AgeConstraint)
  employee_birth_date: Date;

  @IsPhoneNumber('UA')
  @MaxLength(13)
  employee_phone_number: string;

  @MaxLength(50)
  employee_city: string;

  @MaxLength(50)
  employee_street: string;

  @MaxLength(9)
  employee_zip_code: string;

  password_raw: string;
}
