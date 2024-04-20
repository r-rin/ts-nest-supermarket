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

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
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

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('categories')
  @Render('categories')
  async categories(@Req() req) {
    return {
      script: 'categories',
      style: 'categories',
      title: 'Злагода: Категорії',
      currentUser: req.currentEmployee,
      isCategories: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('clients')
  @Render('clients')
  async clients(@Req() req) {
    return {
      script: 'clients',
      style: 'clients',
      title: 'Злагода: Клієнти',
      currentUser: req.currentEmployee,
      isClients: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('products')
  @Render('products')
  async products(@Req() req) {
    return {
      script: 'products',
      style: 'products',
      title: 'Злагода: Продукти',
      currentUser: req.currentEmployee,
      isProducts: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('receipts')
  @Render('receipts')
  async receipts(@Req() req) {
    return {
      script: 'receipts',
      style: 'receipts',
      title: 'Злагода: Чеки',
      currentUser: req.currentEmployee,
      isReceipts: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('supplies')
  @Render('supplies')
  async supplies(@Req() req) {
    return {
      script: 'supplies',
      style: 'supplies',
      title: 'Злагода: Товари',
      currentUser: req.currentEmployee,
      isSupplies: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('employees')
  @Render('employees')
  async employees(@Req() req) {
    return {
      script: 'employees',
      style: 'employees',
      title: 'Злагода: Працівники',
      currentUser: req.currentEmployee,
      isEmployees: true,
    };
  }

  //сторінки для додавання
  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('categories/add-category')
  @Render('add/category')
  async renderAddCategoryPage(@Req() req) {
    return {
      title: 'Додати категорію',
      currentUser: req.currentEmployee,
      isCategories: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('clients/add-client')
  @Render('add/client')
  async renderAddClientPage(@Req() req) {
    return {
      title: 'Додати клієнта',
      currentUser: req.currentEmployee,
      isClients: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('products/add-product')
  @Render('add/product')
  async renderAddProductPage(@Req() req) {
    return {
      title: 'Додати товар',
      currentUser: req.currentEmployee,
      isProducts: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('receipts/add-receipt')
  @Render('add/receipt')
  async renderAddReceiptPage(@Req() req) {
    return {
      title: 'Додати чек',
      currentUser: req.currentEmployee,
      isReceipts: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('supplies/add-supply')
  @Render('add/supply')
  async renderAddESupplyPage(@Req() req) {
    return {
      title: 'Додати товар',
      currentUser: req.currentEmployee,
      isSupplies: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('employees/add-employee')
  @Render('add/employee')
  async renderAddEmployeePage(@Req() req) {
    return {
      title: 'Додати працівника',
      currentUser: req.currentEmployee,
      isEmployees: true,
    };
  }
}
