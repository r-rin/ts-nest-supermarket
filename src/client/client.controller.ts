import { Controller, Get, Render, Req } from '@nestjs/common';
import { Roles } from '../api/auth/roles/roles.decorator';
import { Role } from '../api/auth/roles/role.enum';
import { ApiService } from '../api/api.service';

@Controller()
export class ClientController {
  constructor(private apiService: ApiService) {}

  @Get('login')
  @Render('login')
  login(): void {
    return;
  }

  @Roles(Role.Cashier, Role.Manager)
  @Get('home')
  @Render('home')
  async home(@Req() req) {
    return {
      style: 'home',
      title: 'Злагода: Головна',
      currentUser: req.currentEmployee,
      isHome: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager)
  @Get('categories')
  @Render('categories')
  async categories(@Req() req) {
    return {
      style: 'categories',
      title: 'Злагода: Категорії',
      currentUser: req.currentEmployee,
      isCategories: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager)
  @Get('clients')
  @Render('clients')
  async clients(@Req() req) {
    return {
      style: 'clients',
      title: 'Злагода: Клієнти',
      currentUser: req.currentEmployee,
      isClients: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager)
  @Get('products')
  @Render('products')
  async products(@Req() req) {
    return {
      style: 'products',
      title: 'Злагода: Продукти',
      currentUser: req.currentEmployee,
      isProducts: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager)
  @Get('receipts')
  @Render('receipts')
  async receipts(@Req() req) {
    return {
      style: 'receipts',
      title: 'Злагода: Чеки',
      currentUser: req.currentEmployee,
      isReceipts: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager)
  @Get('supplies')
  @Render('supplies')
  async supplies(@Req() req) {
    return {
      style: 'supplies',
      title: 'Злагода: Товари',
      currentUser: req.currentEmployee,
      isSupplies: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager)
  @Get('employees')
  @Render('employees')
  async employees(@Req() req) {
    return {
      style: 'employees',
      title: 'Злагода: Працівники',
      currentUser: req.currentEmployee,
      isEmployees: true,
    };
  }
}
