import { Controller, Delete, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/role.enum';

@Controller('api/receipts')
export class ReceiptsController {
  constructor(private receiptsService: ReceiptsService) {}

  @Get('all')
  @Roles(Role.Admin, Role.Cashier, Role.Manager)
  async allReceipts(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
  ) {
    return await this.receiptsService.getAllReceipts(limit, page);
  }

  @Get('find/:receiptID')
  @Roles(Role.Admin, Role.Cashier, Role.Manager)
  async findReceipt(@Param('receiptID') receiptID) {
    return await this.receiptsService.findByReceiptID(receiptID);
  }

  @Get('search')
  @Roles(Role.Admin, Role.Cashier, Role.Manager)
  async searchByFilter(
    @Query('receipt_id') receipt_id,
    @Query('employee_id') employee_id,
    @Query('text') text,
    @Query('date_start') date_start,
    @Query('date_end') date_end,
    @Query('sortBy') sortBy,
    @Query('order') order,
    @Query('limit') limit,
    @Query('page') page,
  ) {
    return this.receiptsService.searchByFilter(
      receipt_id,
      text,
      employee_id,
      date_start,
      date_end,
      sortBy,
      order,
      limit,
      page,
    );
  }

  @Delete('delete')
  @Roles(Role.Admin, Role.Manager)
  async deleteReceipt(@Query('id') id) {
    return await this.receiptsService.deleteReceipt(id);
  }
}
