import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/role.enum';
import { IResponseInterface } from '../../interfaces/IResponse.interface';
import { AddClientDTO } from '../../dto/add-client.dto';

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

  @Get('search')
  @Roles(Role.Admin, Role.Cashier, Role.Manager)
  async searchByFilter(
    @Query('id') id,
    @Query('text') text,
    @Query('sortBy') sortBy,
    @Query('order') order,
    @Query('limit') limit,
    @Query('page') page,
  ) {
    return await this.clientsService.searchByFilter(
      id,
      text,
      sortBy,
      order,
      limit,
      page,
    );
  }

  @Post('add')
  @Roles(Role.Admin, Role.Cashier, Role.Manager)
  async addNewClient(
    @Body() addClientDTO: AddClientDTO,
  ): Promise<IResponseInterface> {
    return await this.clientsService.addNewClient(addClientDTO);
  }
}
