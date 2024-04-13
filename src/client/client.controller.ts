import { Controller, Get, Render, Req } from '@nestjs/common';
import { Roles } from '../api/auth/roles/roles.decorator';
import { Role } from '../api/auth/roles/role.enum';
import { IEmployee } from '../api/interfaces/IEmployee.interface';
import { ApiService } from '../api/api.service';

@Controller()
export class ClientController {
  constructor(private apiService: ApiService) {}

  @Get('login')
  @Render('login')
  login(): void {
    return;
  }

  @Roles(Role.Cashier, Role.Manager)
  @Get('home')
  @Render('home')
  async home(@Req() req) {
    const currentEmployee: IEmployee = await this.apiService.getCurrentEmployee(
      req.employeeId,
    );

    return {
      title: 'Злагода: Головна',
      currentUser: currentEmployee,
      isHome: true,
    };
  }
}
