import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from './projects.entity';
import { UserEntity } from 'src/users/users.entity';
import { ProjectMemberEntity } from './project-member.entity';
import { TestSuiteEntity } from 'src/test-suite/test-suite.entity';
import { TestCaseEntity } from 'src/test-cases/test-cases.entity';
import { TestRunEntity } from 'src/test-runs/test-runs.entity';
import { CreateProjectDto } from './dto/create-project.entity';
import { ProjectRoles } from './project-role.enum';
import { CreateTestSuiteDto } from 'src/test-suite/dto/create-test-suite.dto';
import { CreateTestCaseDto } from 'src/test-cases/dto/create-test-cases.dto';
import { CreateTestRunsDto } from 'src/test-runs/dto/create-test-runs.dto';

@Injectable()
export class ProjectsService {

    constructor(
        @InjectRepository(ProjectEntity) private projectRepository: Repository<ProjectEntity>,

        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,

        @InjectRepository(ProjectMemberEntity) private projectMemberRepository: Repository<ProjectMemberEntity>,

        @InjectRepository(TestSuiteEntity) private testSuiteRepository: Repository<TestSuiteEntity>,

        @InjectRepository(TestCaseEntity) private testCaseRepository: Repository<TestCaseEntity>,

        @InjectRepository(TestRunEntity) private testRunRepository: Repository<TestRunEntity>,
    ) {}



    async createProject(ownerId:number,body: CreateProjectDto ):Promise<ProjectEntity>{
        const owner = await this.userRepository.findOne({where:{id: ownerId}});
        if(!owner){
            throw new NotFoundException('Юзер не най    ден');
        }

        const project = this.projectRepository.create({
            ...body,
            owner
        });

        await this.projectRepository.save(project);

        //Сделать юзера Админом
        const member = this.projectMemberRepository.create({
            user: owner,
            project,
            role:ProjectRoles.ADMIN
        });

        await this.projectMemberRepository.save(member);
        return project;
    }

    async getAllProjects():Promise<ProjectEntity[]>{
        return this.projectRepository.find({relations: ['owner','members']});
    }

    async getProjectById(id:number):Promise<ProjectEntity>{
        const project = await this.projectRepository.findOne({where:{id},relations: ['owner', 'members', 'members.user']});
        if(!project){
            throw new NotFoundException('Проект не найден');
        }
        return project;
    }

    async updateProject(ownerId:number, id:number, body:CreateProjectDto):Promise<ProjectEntity>{
        const project = await this.getProjectById(id);
        if(project.owner.id !== ownerId){
            throw new ForbiddenException('Вы не можете редактировать этот проект');
        }
        Object.assign(project, body);
        return this.projectRepository.save(project);
    }

    async deleteProject(ownerId:number, id:number):Promise<{message: string}>{
        const project = await this.getProjectById(id);
        if(project.owner.id !== ownerId){
            throw new ForbiddenException('Вы не можете удалить этот проект');
        }
        await this.projectRepository.remove(project);
        return {message: 'Проект удален'}
        }

    async addMember(projectId:number, userId:number, role:ProjectRoles):Promise<ProjectMemberEntity>{
        const project = await this.getProjectById(projectId);
        const user = await this.userRepository.findOne({where:{id: userId}});
        if(!user){
            throw new NotFoundException('Юзер не найден');
        }

        const existinрMember = await this.projectMemberRepository.findOne
        ({where:{project:{id: projectId}, user:{id: userId}}});
        if(existinрMember){
            throw new NotFoundException('Юзер уже есть');
        }

        const member = this.projectMemberRepository.create({
            user,project, role
        });
        return this.projectMemberRepository.save(member);
    }

    async removeMember(projectId:number, userId:number):Promise<{message: string}>{
        const member = await this.projectMemberRepository.findOne({where:{project:{id: projectId}, user:{id: userId}}});

        if(!member){
            throw new NotFoundException('Участник не найден');
        }

        await this.projectMemberRepository.remove(member);
        return {message: 'Участник удален'}
    }

     //  1. Создание Test Suite в проекте
     async createTestSuite(projectId: number, body:CreateTestSuiteDto): Promise<TestSuiteEntity> {
        const project = await this.projectRepository.findOne({ where: { id: projectId } });
        if (!project) {
            throw new NotFoundException('Проект не найден');
        }

        const testSuite = this.testSuiteRepository.create({
            name: body.name,
            project
        });

        return this.testSuiteRepository.save(testSuite);
    }

    //  2. Создание Test Case в Test Suite внутри проекта
    async createTestCase(projectId: number, testSuiteId: number, body: CreateTestCaseDto): Promise<TestCaseEntity> {
        const testSuite = await this.testSuiteRepository.findOne({
            where: { id: testSuiteId, project: { id: projectId } }, relations: ['project']
        });

        if (!testSuite) {
            throw new NotFoundException('Test Suite не найден в этом проекте');
        }

        const testCase = this.testCaseRepository.create({
            title: body.title,
            description: body.description,
            testSuite
        });

        return this.testCaseRepository.save(testCase);
    }

    // 3. Создание Test Run в Test Case внутри проекта
    async createTestRun(projectId: number, testSuiteId: number, testCaseId: number, body: CreateTestRunsDto): Promise<TestRunEntity> {
        const testCase = await this.testCaseRepository.findOne({
            where: { id: testCaseId, testSuite: { id: testSuiteId, project: { id: projectId } } },
            relations: ['testSuite', 'testSuite.project']
        });

        if (!testCase) {
            throw new NotFoundException('Test Case не найден в этом проекте');
        }

        const testRun = this.testRunRepository.create({
            title: body.title,
            description: body.description,
            status: body.status,
            executionTime: body.executionTime,
            testCase
        });

        return this.testRunRepository.save(testRun);
    }
}
