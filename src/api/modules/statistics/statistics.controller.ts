import { Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('api/statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('total-amount-by-cashier-and-date-range')
  async getTotalAmountByCashierAndDateRange(
    @Query('cashierId') cashierId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (startDate.length > 0 && endDate.length > 0) {
      startDate = new Date(startDate).toISOString().slice(0, 10);
      endDate = new Date(endDate).toISOString().slice(0, 10);
    }
    return await this.statisticsService.getAllReceiptsSum(
      cashierId,
      startDate,
      endDate,
    );
  }

  @Get('the-amount-of-goods-of-each-category-in-a-specific-check')
  async getTotalAmountOfGoodsInEachCategoryInASpecificCheck(
    @Query('receiptNum') receiptNum: string,
  ) {
    return await this.statisticsService.getTotalAmountOfGoodsInEachCategory(
      receiptNum,
    );
  }

  @Get('total-sales-per-category-for-period')
  async getTotalSalesPerCategoryForPeriod(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.statisticsService.getTotalSalesPerCategoryForPeriod(
      startDate,
      endDate,
    );
  }

  @Get('sales-count-per-item-per-employee')
  async getSalesCountPerItemPerEmployee() {
    return await this.statisticsService.getSalesCountPerItemPerEmployee();
  }
}
