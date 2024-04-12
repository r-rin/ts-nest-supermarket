import { Controller, Get, Req } from '@nestjs/common';
import { ApiService } from './api.service';
import { Roles } from './auth/roles/roles.decorator';
import { Role } from './auth/roles/role.enum';

@Controller('api')
export class ApiController {
  constructor(private apiService: ApiService) {}

  @Roles(Role.Cashier, Role.Manager)
  @Get('user')
  async currentEmployee(@Req() req) {
    return await this.apiService.getCurrentEmployee(req.employeeId);
  }
}
