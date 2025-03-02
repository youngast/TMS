import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';

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


}
