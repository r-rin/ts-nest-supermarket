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
    if (cashierId.toLowerCase() === 'all') {
      return await this.getTotalAmountForAllCashiers(startDate, endDate);
    } else {
      return await this.getTotalAmountForCashier(cashierId, startDate, endDate);
    }
  }

  private async getTotalAmountForAllCashiers(
    startDate: string,
    endDate: string,
  ) {
    const totalAmount =
      await this.statisticsService.getTotalAmountOfProductsByDateRange(
        new Date(startDate),
        new Date(endDate),
      );
    return { totalAmount };
  }

  private async getTotalAmountForCashier(
    cashierId: string,
    startDate: string,
    endDate: string,
  ) {
    const totalAmount =
      await this.statisticsService.getTotalAmountOfProductsByCashierAndDateRange(
        cashierId,
        new Date(startDate),
        new Date(endDate),
      );
    return { totalAmount };  }
}
