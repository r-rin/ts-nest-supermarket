import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/role.enum';

@Controller('api/products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get('all')
  @Roles(Role.Admin, Role.Cashier, Role.Manager)
  async allProducts(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
  ) {
    return await this.productsService.getAllProducts(limit, page);
  }

  @Get('find/:productName')
  @Roles(Role.Admin, Role.Cashier, Role.Manager)
  async findProduct(@Param('productName') productName) {
    return await this.productsService.findProductByName(productName);
  }

  @Get('search')
  @Roles(Role.Admin, Role.Cashier, Role.Manager)
  async searchByFilter(
    @Query('productId') id,
    @Query('text') text,
    @Query('categoryNumber') category,
    @Query('sortBy') sortBy,
    @Query('order') order,
    @Query('limit') limit,
    @Query('page') page,
  ) {
    return this.productsService.searchByFilter(id, text, category, sortBy, order, limit, page);
  }
}
