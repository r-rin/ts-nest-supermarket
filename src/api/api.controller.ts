import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api.service';
import { Roles } from './auth/roles/roles.decorator';
import { Role } from './auth/roles/role.enum';

@Controller('api')
export class ApiController {
  constructor(private apiService: ApiService) {}

  @Roles(Role.Cashier)
  @Get('products')
  async getProducts() {
    const products = await this.apiService.getProducts();
    return { data: products };
  }
}
