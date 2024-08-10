import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDTO } from 'src/dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Post()
    async register(
        @Body() body: RegisterDTO
    ) {
        return await this.authService.register(body)
    }
}
