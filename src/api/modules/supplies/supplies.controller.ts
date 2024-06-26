import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/role.enum';
import { AddSupplyDTO } from '../../dto/add-supply.dto';
import { EditSupplyDTO } from '../../dto/edit-supply.dto';
import { CreatePromotionalSupplyDTO } from '../../dto/create-promotional.dto';

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
    return await this.suppliesService.searchByFilter(
      upc,
      text,
      type,
      sortBy,
      order,
      limit,
      page,
    );
  }

  @Post('add')
  @Roles(Role.Admin, Role.Manager)
  async addNewSupply(@Body() addSupplyDTO: AddSupplyDTO) {
    return await this.suppliesService.addNewSupply(addSupplyDTO);
  }

  @Post('edit')
  @Roles(Role.Admin, Role.Manager)
  async editSupply(@Body() editSupplyDTO: EditSupplyDTO) {
    return await this.suppliesService.editSupply(editSupplyDTO);
  }

  @Post('create-promotional')
  @Roles(Role.Admin, Role.Manager)
  async createPromotionalSupply(
    @Body() createPromotionalSupplyDTO: CreatePromotionalSupplyDTO,
  ) {
    return await this.suppliesService.createPromotionalSupply(
      createPromotionalSupplyDTO,
    );
  }

  @Delete('delete')
  @Roles(Role.Admin, Role.Manager)
  async deleteSupply(@Query('upc') id) {
    return await this.suppliesService.deleteSupplies(id);
  }
}
