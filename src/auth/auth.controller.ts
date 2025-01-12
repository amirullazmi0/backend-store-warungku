import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from 'src/dto/auth.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Auth } from 'src/cummon/auth.decorator';
import { user } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('check-auth')
  async checkAuth(@Auth() user: user) {
    return await this.authService.checkAuth(user);
  }

  @Post('register')
  async register(@Body() body: RegisterDTO) {
    return await this.authService.register(body);
  }

  @Post('login')
  async login(
    @Body() body: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.login(body, res);
  }

  @Get('try')
  async try() {
    return this.authService.try();
  }
}
