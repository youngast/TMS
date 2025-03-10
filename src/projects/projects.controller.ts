import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';
import { Request } from 'express';
import { UserEntity } from 'src/users/users.entity';
import { ProjectRoles } from './project-role.enum';
import { ProjectEntity } from './projects.entity';

interface AuthRequest extends Request {
    user: UserEntity;
}

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Post()
    async createProject(@Body() body:CreateProjectDto, @Req() req: AuthRequest) {
        console.log('req.user.id', req.user.id);
        return this.projectsService.createProject(body, req.user.id);
    }

    @Get()
    getAllProjects() {
        return this.projectsService.getAllProjects();
    }

    @Get(':id')
    getProjectById(@Param('id') id: number) {
        return this.projectsService.getProjectById(id);
    }

    @Patch(':id')
    updateProject(@Req() req: AuthRequest, @Param('id') id: number, @Body() body: CreateProjectDto) {
        return this.projectsService.updateProject(req, id, body);
    }

    @Delete(':id')
    deleteProject(@Req() req: AuthRequest, @Param('id') id: number) {
        return this.projectsService.deleteProject(req, id);
    }

    @Post(':projectId/members/:userId')
    async addUserToProject(
      @Req() req: AuthRequest,
      @Param('projectId') projectId: string,
      @Param('userId') userId: string
    ) {
      return this.projectsService.addMember(req, +projectId,+userId);
    }
  
    
    @Delete(':projectId/members/:userId')
    removeMember(@Req() req: AuthRequest, @Param('projectId') projectId: number, @Param('userId') userId: number) {
        return this.projectsService.removeMember(req, projectId, userId);
    }
}
