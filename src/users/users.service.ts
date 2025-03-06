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

    findById(id: number, email?: string): Promise<UserEntity> {
        return this.userRepository.findOne({where: {id: id, email: email || null}});
    }

    create(body: CreateUser): Promise<UserEntity> {
        const user = this.userRepository.create(body);
        return this.userRepository.save(user);
    }

    async updateUser(body: UpdateUser, id:number): Promise<UserEntity> {
        const user = await this.findById(id);

        if(!user) {
            throw new NotFoundException('Юзера нет');}

        Object.assign(user, body);

        return this.userRepository.save(user);
    }

    async deleteUser(id:number): Promise<UserEntity> {
        const user = await this.findById(id);

        if(!user) {
            throw new NotFoundException('Юзера нет');
        } else {
            return this.userRepository.remove(user);
        }
    }

    async changeUserRole(id:number, role:UserRole):Promise<UserEntity>{
        const user = await this.findById(id);
        user.role = role;
        return this.userRepository.save(user);
    }

}
