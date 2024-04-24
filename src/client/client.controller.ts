import { Controller, Get, Query, Render, Req } from '@nestjs/common';
import { Roles } from '../api/auth/roles/roles.decorator';
import { Role } from '../api/auth/roles/role.enum';
import { ClientService } from './client.service';

@Controller()
export class ClientController {
  constructor(private clientService: ClientService) {}

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
      title: 'Злагода: Додати категорію',
      currentUser: req.currentEmployee,
      isCategories: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('clients/add-client')
  @Render('add/client')
  async renderAddClientPage(@Req() req) {
    return {
      title: 'Злагода: Додати клієнта',
      currentUser: req.currentEmployee,
      isClients: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('products/add-product')
  @Render('add/product')
  async renderAddProductPage(@Req() req) {
    return {
      title: 'Злагода: Додати предмет',
      currentUser: req.currentEmployee,
      isProducts: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('receipts/add-receipt')
  @Render('add/receipt')
  async renderAddReceiptPage(@Req() req) {
    return {
      title: 'Злагода: Додати чек',
      currentUser: req.currentEmployee,
      isReceipts: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('supplies/add-supply')
  @Render('add/supply')
  async renderAddESupplyPage(@Req() req) {
    return {
      title: 'Злагода: Додати товар',
      currentUser: req.currentEmployee,
      isSupplies: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('employees/add-employee')
  @Render('add/employee')
  async renderAddEmployeePage(@Req() req) {
    return {
      title: 'Злагода: Додати працівника',
      currentUser: req.currentEmployee,
      isEmployees: true,
    };
  }

  //сторінки для перегляду детальної інформації про..
  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('profile')
  @Render('info/profile')
  async profile(@Req() req, @Query('id') employee_id?: string) {
    return await this.clientService.getProfileRenderObj(req, employee_id);
  }

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('categories/about')
  @Render('info/about-category')
  async renderAboutCategoryPage(@Req() req) {
    return {
      title: 'Злагода: Інформація про категорію',
      currentUser: req.currentEmployee,
      isCategories: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('clients/about')
  @Render('info/about-client')
  async renderAboutClientPage(@Req() req, @Query('id') card_id: string) {
    return await this.clientService.getClientAboutRenderObject(req, card_id);
  }

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('products/about')
  @Render('info/about-product')
  async renderAboutProductPage(@Req() req) {
    return {
      script: 'about-product',
      title: 'Злагода: Інформація про предмет',
      currentUser: req.currentEmployee,
      isProducts: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('receipts/about')
  @Render('info/about-receipt')
  async renderAboutReceiptPage(@Req() req) {
    return {
      title: 'Злагода: Інформація про чек',
      currentUser: req.currentEmployee,
      isReceipts: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('supplies/about')
  @Render('info/about-supply')
  async renderAboutSupplyPage(@Req() req) {
    return {
      title: 'Злагода: Інформація про товар',
      currentUser: req.currentEmployee,
      isSupplies: true,
    };
  }

  //сторінки для редагування
  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('categories/edit-category')
  @Render('edit/category')
  async renderEditCategoryPage(@Req() req) {
    return {
      title: 'Злагода: Редагувати категорію',
      currentUser: req.currentEmployee,
      isCategories: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('clients/edit-client')
  @Render('edit/client')
  async renderEditClientPage(@Req() req, @Query('id') card_id: string) {
    return await this.clientService.getClientEditAboutRender(req, card_id);
  }

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('products/edit-product')
  @Render('edit/product')
  async renderEditProductPage(@Req() req) {
    return {
      title: 'Злагода: Редагувати дані про предмет',
      currentUser: req.currentEmployee,
      isProducts: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('receipts/edit-receipt')
  @Render('edit/receipt')
  async renderEditReceiptPage(@Req() req) {
    return {
      title: 'Злагода: Редагувати чек',
      currentUser: req.currentEmployee,
      isReceipts: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('supplies/edit-supply')
  @Render('edit/supply')
  async renderEditESupplyPage(@Req() req) {
    return {
      title: 'Злагода: Редагувати дані про товар',
      currentUser: req.currentEmployee,
      isSupplies: true,
    };
  }

  @Roles(Role.Cashier, Role.Manager, Role.Admin)
  @Get('employees/edit-employee')
  @Render('edit/employee')
  async renderEditEmployeePage(@Req() req) {
    return {
      title: 'Злагода: Редагувати дані працівника',
      currentUser: req.currentEmployee,
      isEmployees: true,
    };
  }
}
