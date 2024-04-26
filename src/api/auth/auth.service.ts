import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { IEmployeeAuth } from '../interfaces/IEmployeeAuth.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private databaseService: any;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(employee_id: string, password: string): Promise<any> {
    const employee: IEmployeeAuth =
      await this.usersService.findOne(employee_id);
    const error_message: unknown = {
      result: 'error',
      error_title: 'Хибні облікові дані!',
      error: 'Ідентифікатор працівника або пароль хибні, спробуйте ще раз.',
    };

    if (!employee) return error_message;

    const isMatch: boolean = await bcrypt.compare(
      password,
      employee.password_hash.toString(),
    );
    if (!isMatch) return error_message;

    const payload = { sub: employee.employee_id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async updatePassword(employeeId: string, newPassword: string): Promise<void> {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      console.log(newPassword);
      console.log(employeeId);
      await this.databaseService.query(
        `UPDATE Auth_data
             SET password_hash = '${hashedPassword}'
             WHERE employee_id = '${employeeId}'`,
      );
    } catch (error) {
      throw new Error('Failed to update password');
    }
  }
}
