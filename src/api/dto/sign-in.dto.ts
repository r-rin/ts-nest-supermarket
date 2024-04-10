import { IsNotEmpty } from 'class-validator';

export class SignInDTO {
  @IsNotEmpty()
  employee_id: string;

  @IsNotEmpty()
  password: string;

  remember_me: boolean;
}
