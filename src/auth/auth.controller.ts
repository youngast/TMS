import { Body, Controller, Post, Get, Param, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';
import { JwtAuthGuard } from './jwt-auth.guards';

@Controller('auth')
export class AuthController {

    constructor(
        private authservice: AuthService
    ){} 

    @Post('register')
    async register(@Body() body: RegisterDto) {
        const user = await this.authservice.registerUser(body);

        return user;
    }

    @Post('login')
    async login(@Body() body: LoginDto) {
        const user = this.authservice.loginUser(body)
        return user;

    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getuser(@Req() req) {
        return this.authservice.getCurrentUser(req.user.id);
    }
}
