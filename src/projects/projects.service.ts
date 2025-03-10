import { Injectable, NotFoundException, ForbiddenException, Inject, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProjectEntity } from './projects.entity';
import { UserEntity } from 'src/users/users.entity';
import { CreateProjectDto } from './dto/create-project.entity';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';

interface AuthRequest extends Request {
    user: UserEntity;
}

@Injectable()
@UseGuards(JwtAuthGuard)
export class ProjectsService {
    constructor(
        @InjectRepository(ProjectEntity) private projectRepository: Repository<ProjectEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    ) {}
    
    async createProject(body: CreateProjectDto, userId: number): Promise<ProjectEntity> {
        console.log(`Создаём проект от имени пользователя с ID: ${userId}`);
        const owner = await this.userRepository.findOne({ where: { id: userId } });

        if (!owner) {
            throw new NotFoundException('User not found');
        }
        console.log('Owner:', owner);

        const project = this.projectRepository.create({
            name:body.name,
            description:body.description ?? '',
            owner,
            members: [],
        });

        return this.projectRepository.save(project);
    }
    
    async getAllProjects(showRelations = false): Promise<ProjectEntity[]> {
        if (showRelations) {
            return this.projectRepository.find({
                relations: ['owner', 'members'],
            });
        }
        return this.projectRepository.find({
            select: ['id', 'name', 'description'],
        });
    }

    async getProjectById(id: number): Promise<ProjectEntity> {
        const project = await this.projectRepository.findOne({
            where: { id },
            relations: ['owner', 'members'],
        });

        if (!project) {
            throw new NotFoundException('Проект не найден');
        }

        return project;
    }

    async updateProject(req: AuthRequest, id: number, body: CreateProjectDto): Promise<ProjectEntity> {
        const userId = req.user.id;
        const project = await this.getProjectById(id);

        if (project.owner.id !== userId) {
            throw new ForbiddenException("Вы не можете редактировать этот проект");
        }

        Object.assign(project, body);
        return this.projectRepository.save(project);
    }

    async deleteProject(req: AuthRequest, id: number): Promise<{ message: string }> {
        const userId = req.user.id;
        const project = await this.getProjectById(id);

        if (project.owner.id !== userId) {
            throw new ForbiddenException("Вы не можете удалить этот проект");
        }

        await this.projectRepository.remove(project);
        return { message: "Проект удален" };
    }

    async addMember(req: AuthRequest, projectId: number, userId: number): Promise<ProjectEntity> {
        const userIdFromToken = req.user.id;
        const project = await this.projectRepository.findOne({
          where: { id: projectId },
          relations: ["owner", "members"],
        });
      
        if (!project) {
          throw new NotFoundException("Проект не найден");
        }
      
        if (project.owner.id !== userIdFromToken) {
          throw new ForbiddenException("Вы не можете добавлять участников в этот проект");
        }
      
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
          throw new NotFoundException("Юзер не найден");
        }
      
        if (project.members.some(member => member.id === userId)) {
          throw new ForbiddenException("Юзер уже есть в проекте");
        }
      
        project.members.push(user);
        return this.projectRepository.save(project);
      }
      
    async removeMember(req: AuthRequest, projectId: number, userId: number): Promise<{ message: string }> {
        const userIdFromToken = req.user.id;
        const project = await this.getProjectById(projectId);

        if (project.owner.id !== userIdFromToken) {
            throw new ForbiddenException("Вы не можете удалять участников из этого проекта");
        }

        project.members = project.members.filter(member => member.id !== userId);
        await this.projectRepository.save(project);
        return { message: "Участник удален из проекта" };
    }
}
