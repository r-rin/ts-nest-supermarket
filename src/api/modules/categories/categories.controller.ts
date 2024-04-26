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
import { CategoriesService } from './categories.service';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/role.enum';
import { EditCategoryDTO } from '../../dto/edit-category.dto';
import { AddCategoryDTO } from '../../dto/add-category.dto';

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

  @Delete('delete')
  @Roles(Role.Admin, Role.Manager)
  async deleteCategory(@Req() req, @Query('id') id) {
    return await this.categoryService.deleteCategory(req, id);
  }

  @Post('edit')
  @Roles(Role.Admin, Role.Manager)
  async editCategory(@Body() editCategoryDTO: EditCategoryDTO) {
    return await this.categoryService.editCategory(editCategoryDTO);
  }

  @Post('add')
  @Roles(Role.Admin, Role.Manager)
  async addCategory(@Body() addCategoryDTO: AddCategoryDTO) {
    return await this.categoryService.addCategory(addCategoryDTO);
  }
}
