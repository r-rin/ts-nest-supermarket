import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
  constructor(private apiService: ApiService) {}

  @Get('products')
  async getProducts() {
    const products = await this.apiService.getProducts();
    return { data: products };
  }
}
