import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';
import { UserEntity } from '../users/users.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService
    ) {}

    async findById(id: number): Promise<UserEntity> {
        return this.userRepository.findOne({ where: { id } });
    }

    async findByEmail(email: string): Promise<UserEntity> {
        return this.userRepository.findOne({ where: { email } });
    }

    // Регистрация пользователя
    async registerUser(body: RegisterDto): Promise<{ accessToken: string }> {
        const existingUser = await this.findByEmail(body.email);
        if (existingUser) {
            throw new UnauthorizedException('Пользователь уже существует');
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);
        const newUser = this.userRepository.create({
            name: body.name,
            email: body.email,
            password: hashedPassword,
        });

        await this.userRepository.save(newUser);

        return {
            accessToken: this.jwtService.sign({ id: newUser.id, email: newUser.email }),
        };
    }

    // Авторизация пользователя
    async loginUser(body: LoginDto): Promise<{ accessToken: string }> {
        const user = await this.findByEmail(body.email);
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        const isMatch = await bcrypt.compare(body.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Неправильный пароль');
        }

        return {
            accessToken: this.jwtService.sign({ id: user.id, email: user.email }),
        };
    }
}
