import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/role.enum';

@Controller('api/clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get('all')
  @Roles(Role.Admin, Role.Cashier, Role.Manager)
  async allClients(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
  ) {
    return await this.clientsService.getAllClients(limit, page);
  }

  @Get('find/:clientName/:clientSurname/:clientPatronimic')
  @Roles(Role.Admin, Role.Cashier, Role.Manager)
  async findClient(
    @Param('clientName') clientName: string,
    @Param('clientSurname') clientSurname: string,
    @Param('clientPatronimic') clientPatronimic: string,
  ) {
    return await this.clientsService.findClientByPIB(
      clientName,
      clientSurname,
      clientPatronimic,
    );
  }
}
