import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/role.enum';

@Controller('api/products')
export class ProductsController {
  constructor(private categoryService: ProductsService) {}

  @Get('all')
  @Roles(Role.Admin, Role.Cashier, Role.Manager)
  async allProducts(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
  ) {
    return await this.categoryService.getAllProducts(limit, page);
  }

  @Get('find/:productName')
  @Roles(Role.Admin, Role.Cashier, Role.Manager)
  async findProduct(@Param('productName') productName) {
    return await this.categoryService.findProductByName(productName);
  }
}
