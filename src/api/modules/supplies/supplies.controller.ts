import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/role.enum';

@Controller('api/supplies')
export class SuppliesController {
  constructor(private suppliesService: SuppliesService) {}

  @Get('all')
  @Roles(Role.Admin, Role.Cashier, Role.Manager)
  async allSupplies(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
  ) {
    return await this.suppliesService.getAllSupplies(limit, page);
  }

  @Get('find/:UPC')
  @Roles(Role.Admin, Role.Cashier, Role.Manager)
  async findSupply(@Param('UPC') upc) {
    return await this.suppliesService.findByUPC(upc);
  }

  @Get('search')
  @Roles(Role.Admin, Role.Cashier, Role.Manager)
  async searchByFilter(
    @Query('UPC') upc,
    @Query('text') text,
    @Query('type') type,
    @Query('sortBy') sortBy,
    @Query('order') order,
    @Query('limit') limit,
    @Query('page') page,
  ) {
    return this.suppliesService.searchByFilter(
      upc,
      text,
      type,
      sortBy,
      order,
      limit,
      page,
    );
  }
}
