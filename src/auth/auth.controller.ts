import { Body, Controller, Post, Get, Param, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guards';

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


    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getuser(@Req() req) {
        console.log(req.user);
        return this.authService.getCurrentUser(req.user.id);
    }
}
    