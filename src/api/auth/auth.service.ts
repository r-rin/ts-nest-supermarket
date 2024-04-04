import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { IEmployeeAuth } from '../interfaces/IEmployeeAuth.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signIn(employee_id: string, password: string): Promise<any> {
    const employee: IEmployeeAuth = await this.usersService.findOne(employee_id);
    const error_message: Object = { result: "error", error_title: "Хибні облікові дані!", error: "Ідентифікатор працівника або пароль хибні, спробуйте ще раз."};

    if (!employee) return error_message;

    let isMatch: boolean = await bcrypt.compare(password, employee.password_hash.toString());
    if (!isMatch) return error_message;

    return {result: 'success'};
  }
}