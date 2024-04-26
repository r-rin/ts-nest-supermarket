import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/role.enum';
import { IResponseInterface } from '../../interfaces/IResponse.interface';
import { AddClientDTO } from '../../dto/add-client.dto';
import { EditCategoryDTO } from '../../dto/edit-category.dto';
import { EditClientDTO } from '../../dto/edit-client.dto';

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
    @Query('percent') percent,
    @Query('sortBy') sortBy,
    @Query('order') order,
    @Query('limit') limit,
    @Query('page') page,
  ) {
    return await this.clientsService.searchByFilter(
      id,
      text,
      percent,
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

  @Post('edit')
  @Roles(Role.Admin, Role.Manager)
  async editClient(@Body() editClientDTO: EditClientDTO) {
    return await this.clientsService.editClient(editClientDTO);
  }

  @Delete('delete')
  @Roles(Role.Admin, Role.Manager)
  async deleteClients(@Req() req, @Query('id') id) {
    return await this.clientsService.deleteClient(req, id);
  }
}
