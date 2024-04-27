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

  @Get('total-units-sold-for-product-in-period')
  async getTotalUnitsSoldForProductInPeriod(
    @Query('productID') productID: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (startDate.length > 0 && endDate.length > 0) {
      startDate = new Date(startDate).toISOString().slice(0, 10);
      endDate = new Date(endDate).toISOString().slice(0, 10);
    }
    return await this.statisticsService.getTotalUnitsSoldForProductInPeriod(
      productID,
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
  async getSalesCountPerItemPerEmployee(
  @Query('minValue') minValue: string,){
    return await this.statisticsService.getSalesCountPerItemPerEmployee(
      minValue,
    );
  }

  @Get('employees-sold-to-every-client')
  async getEmployeesSoldToEveryClient() {
    return await this.statisticsService.getEmployeesSoldToEveryClient();
  }

  @Get('employees-sold-every-product')
  async getAllEmployeesWhoSoldAllProducts() {
    return await this.statisticsService.getAllEmployeesWhoSoldAllProducts();
  }

  @Get('employees-sold-supply-from-every-category')
  async getEmployeesWhoSoldSuppliesFromEveryCategory() {
    return await this.statisticsService.getEmployeesWhoSoldSuppliesFromEveryCategory();
  }
}
