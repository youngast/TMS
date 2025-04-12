import { Injectable, NotFoundException, ForbiddenException, Inject, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { ProjectEntity } from './projects.entity';
import { UserEntity } from 'src/users/users.entity';
import { CreateProjectDto } from './dto/create-project.entity';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';

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

    async addMember(req: AuthRequest, projectId: number, userEmail: string): Promise<ProjectEntity> {
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
      
        const user = await this.userRepository.findOne({ where: { email: userEmail } });
        if (!user) {
          throw new NotFoundException("Пользователь не найден");
        }
      
        const alreadyMember = project.members.find(member => member.id === user.id);
        if (alreadyMember) {
          throw new ForbiddenException("Пользователь уже в проекте");
        }
      
        project.members.push(user);
        return this.projectRepository.save(project);
      }      
      
      async removeMember(req: AuthRequest, projectId: number, userEmail: string): Promise<{ message: string }> {
        const userIdFromToken = req.user.id;
        const project = await this.getProjectById(projectId);
      
        if (project.owner.id !== userIdFromToken) {
          throw new ForbiddenException("Вы не можете удалять участников из этого проекта");
        }
      
        const user = await this.userRepository.findOne({ where: { email: userEmail } });
        if (!user) {
          throw new NotFoundException("Пользователь не найден");
        }
      
        project.members = project.members.filter(member => member.id !== user.id);
        await this.projectRepository.save(project);
        return { message: "Участник удален из проекта" };
      }      

    async FindByName(name: string): Promise<ProjectEntity[]> {
        return this.projectRepository.find({
            where: { name: ILike(`%${name}%`) },
            relations: ['owner', 'members'],
        });
    }

    async checkUserAccess(projectId: number, userId: number): Promise<boolean> {
        const project = await this.projectRepository.findOne({
          where: { id: projectId },
          relations: ['owner', 'members'],
        });
      
        if (!project) return false;
      
        const isOwner = project.owner.id === userId;
        const isMember = project.members.some(member => member.id === userId);
      
        return isOwner || isMember;
      }

      async getProjectsByUser(userId: number): Promise<ProjectEntity[]> {
        const projects = await this.projectRepository.find({
          where: [
            { owner: { id: userId } },
            { members: { id: userId } },
          ],
          select: {
            id: true,
            name: true,
            owner: {
              id: true,
              email: true,
              name: true,
            },
            members: {
              id: true,
              email: true,
              name: true,
            },
          },
          relations: {
            owner: true,
            members: true,
          },
        });
        if (!projects || projects.length === 0) {
            throw new ForbiddenException('Нет проектов');
          }
        return projects;
      }

}
