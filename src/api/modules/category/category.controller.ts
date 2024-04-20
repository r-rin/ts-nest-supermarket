import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/role.enum';

@Controller('api/categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

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
}
