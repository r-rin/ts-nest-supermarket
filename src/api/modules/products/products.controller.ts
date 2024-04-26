import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/role.enum';
import { IResponseInterface } from '../../interfaces/IResponse.interface';
import { AddProductDTO } from '../../dto/add-product.dto';
import { EditCategoryDTO } from '../../dto/edit-category.dto';
import { EditProductDTO } from '../../dto/edit-product.dto';

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
    return this.productsService.searchByFilter(
      id,
      text,
      category,
      sortBy,
      order,
      limit,
      page,
    );
  }

  @Post('add')
  @Roles(Role.Admin, Role.Cashier, Role.Manager)
  async addNewProduct(
    @Body() addProductDTO: AddProductDTO,
  ): Promise<IResponseInterface> {
    return await this.productsService.addNewProduct(addProductDTO);
  }

  @Delete('delete')
  @Roles(Role.Admin, Role.Manager)
  async deleteProduct(@Req() req, @Query('id') id) {
    return await this.productsService.deleteProduct(req, id);
  }

  @Post('edit')
  @Roles(Role.Admin, Role.Manager)
  async editProduct(@Body() editProductDTO: EditProductDTO) {
    return await this.productsService.editProduct(editProductDTO);
  }
}
