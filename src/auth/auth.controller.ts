import { Body, Controller, Post, Res } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from 'src/dto/auth.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Post('register')
    async register(
        @Body() body: RegisterDTO
    ) {
        return await this.authService.register(body)
    }

    @Post('login')
    async login(
        @Body() body: LoginDTO,
        @Res({ passthrough: true }) res: Response
    ) {
        return await this.authService.login(body, res)
    }
}
