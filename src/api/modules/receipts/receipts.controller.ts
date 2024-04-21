import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
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
}
