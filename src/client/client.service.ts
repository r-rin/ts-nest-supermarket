import { Injectable } from '@nestjs/common';
import { EmployeesService } from '../api/modules/employees/employees.service';
import { ClientsService } from '../api/modules/clients/clients.service';
import { ApiService } from '../api/api.service';
import { CategoriesService } from '../api/modules/categories/categories.service';
import { SuppliesService } from '../api/modules/supplies/supplies.service';
import { ProductsService } from '../api/modules/products/products.service';
import { ReceiptsService } from '../api/modules/receipts/receipts.service';

@Injectable()
export class ClientService {
  constructor(
    private employeesService: EmployeesService,
    private clientsService: ClientsService,
    private apiService: ApiService,
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private suppliesService: SuppliesService,
    private receiptsService: ReceiptsService,
  ) {}

  formatDate(inputDate: string) {
    const date: Date = new Date(inputDate);
    return date.toLocaleDateString('en-GB');
  }

  async getProfileRenderObj(req: any, employee_id: string) {
    const toRender = {
      title: 'Профіль',
      style: 'profile',
      currentUser: req.currentEmployee,
      isEmployees: true,
      employee: null,
    };

    if (employee_id) {
      toRender.employee = await this.employeesService.getEmployee(employee_id);
    } else {
      toRender.employee = req.currentEmployee;
    }

    if (toRender.employee) {
      toRender.employee.employee_start_date = this.formatDate(
        toRender.employee.employee_start_date,
      );
      toRender.employee.employee_birth_date = this.formatDate(
        toRender.employee.employee_birth_date,
      );
    }

    return toRender;
  }

  async getClientAboutRenderObject(req, card_id) {
    const toRender = {
      script: 'about-client',
      style: 'about-clients',
      title: 'Інформація про клієнта',
      currentUser: req.currentEmployee,
      isClients: true,
      customer_card: null,
    };

    toRender.customer_card = await this.clientsService.getClientCard(card_id);
    return toRender;
  }

  async getClientEditAboutRender(req, card_id: string) {
    return {
      title: 'Редагувати дані клієнта',
      script: 'edit-client',
      currentUser: req.currentEmployee,
      isClients: true,
      customer_card: await this.clientsService.getClientCard(card_id),
    };
  }

  async getEmployeesRenderObject(req: any) {
    return {
      script: 'employees',
      style: 'employees',
      title: 'Злагода: Працівники',
      currentUser: req.currentEmployee,
      rolesDict: Object.entries(await this.apiService.getAllRoles()),
      citiesArr: await this.employeesService.getAllTowns(),
      isEmployees: true,
    };
  }

  async getProductsRenderObject(req) {
    return {
      script: 'products',
      style: 'products',
      title: 'Злагода: Предмети',
      currentUser: req.currentEmployee,
      categoriesDict: Object.entries(
        await this.categoriesService.getAllCategoriesDict(),
      ),
      isProducts: true,
    };
  }

  async getAddEmployeeRenderObject(req) {
    return {
      title: 'Злагода: Додати працівника',
      script: 'add-employee',
      currentUser: req.currentEmployee,
      rolesDict: Object.entries(await this.apiService.getAllRoles()),
      isEmployees: true,
    };
  }

  async renderAddProductPage(req) {
    return {
      title: 'Злагода: Додати предмет',
      script: 'add-product',
      currentUser: req.currentEmployee,
      isProducts: true,
      categoriesDict: Object.entries(
        await this.categoriesService.getAllCategoriesDict(),
      ),
    };
  }

  async getAddSupplyRenderObject(req) {
    return {
      title: 'Злагода: Додати товар',
      script: 'add-supply',
      currentUser: req.currentEmployee,
      isSupplies: true,
      productsDict: Object.entries(
        await this.productsService.getProductsDict(),
      ),
    };
  }

  async getAddClientRenderObject(req) {
    return {
      title: 'Злагода: Додати клієнта',
      script: 'add-client',
      currentUser: req.currentEmployee,
      isClients: true,
    };
  }

  async getAboutProductRenderObject(req, product_id: number) {
    return {
      style: 'about-product',
      script: 'about-product',
      title: 'Злагода: Інформація про предмет',
      currentUser: req.currentEmployee,
      product: await this.productsService.getProductJoin(product_id),
      isProducts: true,
    };
  }

  async getAboutSupplyRenderObject(req, upc: string) {
    return {
      title: 'Злагода: Інформація про товар',
      style: 'about-supply',
      script: 'about-supply',
      currentUser: req.currentEmployee,
      isSupplies: true,
      supply: await this.suppliesService.findByUPC(upc),
    };
  }

  async getAboutCategoryRenderObject(req, id: number) {
    return {
      script: 'about-category',
      style: 'about-category',
      title: 'Злагода: Інформація про категорію',
      currentUser: req.currentEmployee,
      isCategories: true,
      category: await this.categoriesService.getCategory(id),
    };
  }

  async getReceiptAboutRenderObject(req, id) {

    let receipt = await this.receiptsService.findByReceiptID(id);

    let products_sum = (rec) => {
      if (!rec) return 0;
      let productsAmount = rec.product_id_list.length;
      let sum = 0;
      for (let i = 0; i < productsAmount; i++) {
        sum += rec.sold_products_amount_list[i] * rec.selling_price_list[i]
      }
      return sum
    };

    return {
      title: 'Злагода: Інформація про чек',
      currentUser: req.currentEmployee,
      isReceipts: true,
      receipt: receipt,
      vat: await this.apiService.getVariableValue('vat'),
      products_sum: products_sum(receipt),
    };
  }

  async getEditCategoriesRenderObject(req, id) {
    return {
      title: 'Злагода: Редагувати категорію',
      script: 'edit-category',
      currentUser: req.currentEmployee,
      isCategories: true,
      category: await this.categoriesService.getCategory(id),
    };
  }

  async getEditProductRenderObject(req, id) {
    return {
      title: 'Злагода: Редагувати дані про предмет',
      script: 'edit-product',
      currentUser: req.currentEmployee,
      isProducts: true,
      product: await this.productsService.getProductJoin(id),
      categoriesDict: Object.entries(
        await this.categoriesService.getAllCategoriesDict(),
      ),
    };
  }

  async getAddCategoryRenderObject(req) {
    return {
      title: 'Злагода: Додати категорію',
      script: 'add-category',
      currentUser: req.currentEmployee,
      isCategories: true,
    };
  }

  async getEditEmployeeRenderObject(req, id) {
    let employee = await this.employeesService.getEmployee(id);
    if (employee) {
      employee.employee_birth_date = new Date(employee.employee_birth_date).toISOString().slice(0, 10);
      employee.employee_start_date = new Date(employee.employee_start_date).toISOString().slice(0, 10);
    }

    return {
      title: 'Злагода: Редагувати дані працівника',
      script: 'edit-employee',
      currentUser: req.currentEmployee,
      employee: employee,
      rolesDict: Object.entries(await this.apiService.getAllRoles()),
      isEmployees: true,
    };
  }

  async getEditSupplyRenderObject(req, id) {
    let supply = await this.suppliesService.findByUPCDataRaw(id);
    if (supply) {
      supply.expiration_date = new Date(supply.expiration_date).toISOString().slice(0, 10);
      supply.manufacturing_date = new Date(supply.manufacturing_date).toISOString().slice(0, 10);
    }

    return {
      title: 'Злагода: Редагувати дані про товар',
      script: 'edit-supply',
      currentUser: req.currentEmployee,
      isSupplies: true,
      supply: supply,
      productsDict: Object.entries(
        await this.productsService.getProductsDict(),
      ),
    };
  }

  async getCreatePromotionalSupplyRenderObject(req, upc) {
    let supply = await this.suppliesService.findByUPCDataRaw(upc);
    if (supply) {
      supply.expiration_date = new Date(supply.expiration_date).toISOString().slice(0, 10);
      supply.manufacturing_date = new Date(supply.manufacturing_date).toISOString().slice(0, 10);
    }

    return {
      title: 'Злагода: Створення акційного товару',
      script: 'create-promotional',
      currentUser: req.currentEmployee,
      isSupplies: true,
      supply: supply,
    };
  }
}
