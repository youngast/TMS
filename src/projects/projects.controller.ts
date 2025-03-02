import { Controller, Get, Param, ParseIntPipe, Post, Body, Patch,Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.entity';
import { CreateTestCaseDto } from 'src/test-cases/dto/create-test-cases.dto';
import { CreateTestRunsDto } from 'src/test-runs/dto/create-test-runs.dto';
import { ProjectRoles } from './project-role.enum';

@Controller('projects')
export class ProjectsController {
    constructor(private projectService: ProjectsService){}

    @Get()
    getAllProject(){
        return this.projectService.getAllProjects();
    }

    @Get(':id')
    getProjectById(@Param('id', ParseIntPipe) id: string){
        return this.projectService.getProjectById(+id);
    }

    @Post(':ownerId')
    createProject(@Param('ownerId') ownerId: string, @Body() body: CreateProjectDto) {
        return this.projectService.createProject(+ownerId, body);
    }

    @Patch(':id/:ownerId')
    updateProject(@Param('id') id: string, @Param('ownerId') ownerId: string, @Body() body: CreateProjectDto) {
        return this.projectService.updateProject(+ownerId, +id, body);
    }
    
    @Delete(':id/:ownerId')
    deleteProject(@Param('id') id: string, @Param('ownerId') ownerId: string) {
        return this.projectService.deleteProject(+ownerId, +id);
    }

    @Post(':projectId/members/')
    addMemberProject(@Param('projectId') projectId: string, @Body() body:{userId: string, role: ProjectRoles}) {
        return this.projectService.addMember(+projectId, +body.userId, body.role);
    }

    @Delete(':projectId/members/:userId')
    removeMemberProject(@Param('projectId') projectId: string, @Param('userId') userId: string) {
        return this.projectService.removeMember(+projectId, +userId);
    }


    // забыл сделать логику обновить роли
    // @Patch(':projectId/members/:userId')
    // updateMemberProject(@Param('projectId') projectId: string, @Param('userId') userId: string) {
    //     return this.projectService.updateMember(+projectId, +userId);
    // }

    @Post(':projectId/test-suites/:testSuiteId/test-cases')
    createTestCase(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Param('testSuiteId', ParseIntPipe) testSuiteId: number,
        @Body() dto: CreateTestCaseDto
    ) {
        return this.projectService.createTestCase(projectId, testSuiteId, dto);
    }

    @Post(':projectId/test-suites/:testSuiteId/test-cases/:testCaseId/test-runs')
    createTestRun(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Param('testSuiteId', ParseIntPipe) testSuiteId: number,
        @Param('testCaseId', ParseIntPipe) testCaseId: number,
        @Body() dto: CreateTestRunsDto
    ) {
        return this.projectService.createTestRun(projectId, testSuiteId, testCaseId, dto);
    }}
