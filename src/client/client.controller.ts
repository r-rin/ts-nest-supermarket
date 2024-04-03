import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class ClientController {
  @Get('login')
  @Render('login')
  login(): void {
    return;
  }
}
