import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDTO } from '../dto/sign-in.dto';
import { Roles } from './roles/roles.decorator';
import { Role } from './roles/role.enum';

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

  @Post('logout')
  async signOut(@Res() res) {
    const cookieOptions: CookieOptions = {
      sameSite: 'strict',
      httpOnly: true,
    };

    res.clearCookie('access_token', cookieOptions);
    return res.redirect('/login');
  }

  @Post('update-password')
  @Roles(Role.Admin, Role.Cashier, Role.Manager)
  async updatePassword(
    @Body() updatePasswordDto: { newPassword: string },
    @Req() req,
  ) {
    await this.authService.updatePassword(
      req.currentEmployee.employee_id,
      updatePasswordDto.newPassword,
    );
  }
}
