import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        private readonly userService: UsersService
    ){}

    findById(id: number): Promise<UserEntity> {
        return this.userRepository.findOne({where: {id}});
    }

    findByEmail(email: string): Promise<UserEntity> {
        return this.userRepository.findOne({where: {email}});
    }

    async registerUser(body: RegisterDto): Promise<UserEntity> {
        const user = await this.findByEmail(body.email);
        if(user) {
            throw new Error('Юзер есть');
        }
        const hashedpassword = bcrypt.hash(body.password, 10);

        const newUser = this.userRepository.create({password: hashedpassword});
        return this.userRepository.save(newUser);
    }
    
    async loginUser(body: LoginDto): Promise<UserEntity> {
        const user = await this.findByEmail(body.email);
        if (!user) {
            throw new NotFoundException(`Пользователь не найден`);
        }
        
        const isMatch = await bcrypt.compare(body.password, user.password);
        if (!isMatch) {
            throw new Error('Неправильный пароль');
        }
        return user;
    }

    async getCurrentUser(userId: number) {
        return this.userService.findById(userId);
      }
}
