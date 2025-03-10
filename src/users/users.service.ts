import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUser } from './dto/create-users.dto';
import { UpdateUser } from './dto/update-users.dto';
import { UserRole } from './user-role.enum';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
    ) {}

    findAll(id: number, email?: string, ):Promise<UserEntity[]> {
        return this.userRepository.find({where: {id: id, email: email || null}});
    }

    async getUserById(userId: number): Promise<UserEntity> {
        console.log("🔍 Ищем пользователя с ID:", userId);
        if (!userId || isNaN(userId)) {
          throw new NotFoundException('Некорректный ID пользователя');
        }
    
        const user = await this.userRepository.findOne({ where: { id: userId } });
    
        if (!user) {
          throw new NotFoundException('Пользователь не найден');
        }
    
        return user;
      }
    
    create(body: CreateUser): Promise<UserEntity> {
        const user = this.userRepository.create(body);
        return this.userRepository.save(user);
    }

    async updateUser(body: UpdateUser, id:number): Promise<UserEntity> {
        const user = await this.getUserById(id);

        if(!user) {
            throw new NotFoundException('Юзера нет');}

        Object.assign(user, body);

        return this.userRepository.save(user);
    }

    async deleteUser(id:number): Promise<UserEntity> {
        const user = await this.getUserById(id);

        if(!user) {
            throw new NotFoundException('Юзера нет');
        } else {
            return this.userRepository.remove(user);
        }
    }

    async changeUserRole(id:number, role:UserRole):Promise<UserEntity>{
        const user = await this.getUserById(id);
        user.role = role;
        return this.userRepository.save(user);
    }

}
