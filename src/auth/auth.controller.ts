import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() body: RegisterDto) {
        return this.authService.registerUser(body);
    }

    @Post('login')
    async login(@Body() body: LoginDto) {
        return this.authService.loginUser(body);
    }
}
