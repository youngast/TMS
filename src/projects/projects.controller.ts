import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Req, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { Request } from 'express';
import { UserEntity } from 'src/users/users.entity';
import { ProjectRoles } from './project-role.enum';
import { ProjectEntity } from './projects.entity';
import { ProjectAccessGuard } from 'src/auth/guards/project-access.guard';

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

    // @Get(':id')
    // getProjectById(@Param('id') id: number) {
    //     return this.projectsService.getProjectById(id);
    // }

    @Patch(':id')
    updateProject(@Req() req: AuthRequest, @Param('id') id: number, @Body() body: CreateProjectDto) {
        return this.projectsService.updateProject(req, id, body);
    }

    @Delete(':id')
    deleteProject(@Req() req: AuthRequest, @Param('id') id: number) {
        return this.projectsService.deleteProject(req, id);
    }

    @Post(':projectId/members/:email')
    addUserToProject(
      @Req() req: AuthRequest,
      @Param('projectId') projectId: number,
      @Param('email') email: string
    ) {
      return this.projectsService.addMember(req, projectId, email);
    }
    
    @Delete(':projectId/members/:email')
    removeUserFromProject(
      @Req() req: AuthRequest,
      @Param('projectId') projectId: number,
      @Param('email') email: string
    ) {
      return this.projectsService.removeMember(req, projectId, email);
    }

    @Get('name')
    FindByName(@Query('name') name: string) {
        console.log(`name =${name} `)
        return this.projectsService.FindByName(name);
    }

    @Get('/myproject')
    getMyProjects(@Req() req: AuthRequest) {
    return this.projectsService.getProjectsByUser(req.user.id);
    }

    @UseGuards(ProjectAccessGuard)
    @Get(':projectId')
    getProject(@Param('projectId') projectId: number) {
      return this.projectsService.getProjectById(projectId);
    }

}
