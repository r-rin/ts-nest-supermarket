import { Controller, Get, Req } from '@nestjs/common';
import { ApiService } from './api.service';
import { Roles } from './auth/roles/roles.decorator';
import { Role } from './auth/roles/role.enum';

@Controller('api')
export class ApiController {
  constructor(private apiService: ApiService) {}

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('user')
  async currentEmployee(@Req() req) {
    return req.currentEmployee;
  }

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('allRoles')
  async getAllRoles() {
    return this.apiService.getAllRoles();
  }
}
