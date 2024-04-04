import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDTO } from '../dto/sign-in.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async signIn(@Body() signInDto: SignInDTO, @Res() res: Response) {
    const result = await this.authService.signIn(signInDto.employee_id, signInDto.password);

    if (result.result === 'error') {
      return res.status(HttpStatus.UNAUTHORIZED).json(result);
    }
    //TODO: JWT token authorization
    return res.redirect('/home');
  }
}
