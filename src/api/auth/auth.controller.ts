import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDTO } from '../dto/sign-in.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async signIn(@Body() signInDto: SignInDTO, @Res() res: Response) {
    const result = await this.authService.signIn(
      signInDto.employee_id,
      signInDto.password,
    );

    if (result.result === 'error') {
      return res.status(HttpStatus.UNAUTHORIZED).json(result);
    }

    const cookieOptions: CookieOptions = {
      sameSite: 'strict',
      httpOnly: true,
    };

    if (!signInDto.remember_me) {
      cookieOptions.expires = undefined;
    } else {
      cookieOptions.expires = new Date(Date.now() + 12 * 60 * 60 * 1000);
    }

    res.cookie('access_token', result.access_token, cookieOptions);
    return res.redirect('/home');
  }
}
