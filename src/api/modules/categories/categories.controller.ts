import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/role.enum';

@Controller('api/categories')
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  @Get('all')
  @Roles(Role.Admin, Role.Cashier, Role.Manager)
  async allCategories(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
  ) {
    return await this.categoryService.getAllCategories(limit, page);
  }

  @Get('find/:categoryName')
  @Roles(Role.Admin, Role.Cashier, Role.Manager)
  async findCategory(@Param('categoryName') categoryName) {
    return await this.categoryService.findByName(categoryName);
  }

  @Get('search')
  @Roles(Role.Admin, Role.Cashier, Role.Manager)
  async searchByFilter(
    @Query('id') id,
    @Query('text') text,
    @Query('sortBy') sortBy,
    @Query('order') order,
    @Query('limit') limit,
    @Query('page') page,
  ) {
    return this.categoryService.searchByFilter(
      id,
      text,
      sortBy,
      order,
      limit,
      page,
    );
  }
}
