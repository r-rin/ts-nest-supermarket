import { Injectable } from '@nestjs/common';
import { EmployeesService } from '../api/modules/employees/employees.service';
import { ClientsService } from '../api/modules/clients/clients.service';
import { ApiService } from '../api/api.service';
import { CategoriesService } from '../api/modules/categories/categories.service';

@Injectable()
export class ClientService {

  constructor(
    private employeesService: EmployeesService,
    private clientsService: ClientsService,
    private apiService: ApiService,
    private categoriesService: CategoriesService,
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
    const toRender =  {
      title: 'Інформація про клієнта',
      currentUser: req.currentEmployee,
      isClients: true,
      customer_card: null,
    };

    toRender.customer_card = await this.clientsService.getClientCard(card_id);
    return toRender;
  }

  async getClientEditAboutRender(req, card_id: string) {
    const toRender = {
      title: 'Редагувати дані клієнта',
      currentUser: req.currentEmployee,
      isClients: true,
      customer_card: null,
    };

    toRender.customer_card = await this.clientsService.getClientCard(card_id);
    return toRender;
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
      categoriesDict: Object.entries(await this.categoriesService.getAllCategories()),
      isProducts: true,
    };
  }
}
