import { BadRequestException, Body, Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTestSuiteDto } from './dto/create-test-suite.dto';
import { TestSuiteEntity } from './test-suite.entity';
import { ProjectEntity } from 'src/projects/projects.entity';


@Injectable()
export class TestSuiteService {

    constructor(
        @InjectRepository(TestSuiteEntity) private testSuiteRepository: Repository<TestSuiteEntity>,
        @InjectRepository(ProjectEntity) private projectRepository: Repository<ProjectEntity>,
    ){

    }

    async findAllTestSuite(projectId:number): Promise<TestSuiteEntity[]>{
        return this.testSuiteRepository.find({
            where: { project: { id: projectId } },
            relations: ['project']
        });        
    }


    async createTestSuite(body: CreateTestSuiteDto, projectId: number): Promise<TestSuiteEntity> {
        if (isNaN(projectId)) {
            throw new BadRequestException('Некорректный projectId');
        }

        const project = await this.projectRepository.findOne({ where: { id: projectId } });

        if (!project) {
            throw new NotFoundException(`Проект с id ${projectId} не найден`);
        }
    
        const testSuite = this.testSuiteRepository.create({ ...body, project });
        return this.testSuiteRepository.save(testSuite);
    }

    async findOneTestSuite(id: number): Promise<TestSuiteEntity> {
        if(!id){
            throw new BadRequestException('Некорректный id');
        }

        const testSuite = await this.testSuiteRepository.findOne({
            where: {id},
            relations: ['project']
        })

        if (!testSuite) {
            throw new NotFoundException(`Test Suite с id ${id} не найден`);
        }

        return testSuite;
    }
    

    async findTestSuiteByProjectId(projectId: number): Promise<TestSuiteEntity[]> {
        return this.testSuiteRepository.find({
            where: { project: { id: projectId } },
            relations: ['project']
        });
    }

    async updateTestSuite(projectId: number, id: number, body: CreateTestSuiteDto): Promise<TestSuiteEntity> {
        const testSuite = await this.testSuiteRepository.findOne({
            where: { id },
            relations: ['project']
        });
    
        if (!testSuite) {
            throw new NotFoundException(`Тест-сьют ID ${id} не найден`);
        }
    
        if (testSuite.project.id !== projectId) {
            throw new NotFoundException(`Тест-сьют ID ${id} не принадлежит проекту ID ${projectId}`);
        }
    
        if (!body || Object.keys(body).length === 0) {
            throw new BadRequestException("Данные для обновления отсутствуют");
        }
    
        Object.assign(testSuite, body);
        return this.testSuiteRepository.save(testSuite);
    }

    async deleteTestSuite(projectId: number, id: number): Promise<{ message: string }> {
        const testSuite = await this.testSuiteRepository.findOne({
            where: { id },
            relations: ['project']
        });
        if (!testSuite) {
            throw new NotFoundException(`Тест-сьют ID ${id} не найден`);
        }
        if (testSuite.project.id !== projectId) {
            throw new NotFoundException(`Тест-сьют ID ${id} не принадлежит проекту ID ${projectId}`);
        }
        await this.testSuiteRepository.remove(testSuite);
        return { message: `✅ Тест-сьют "${testSuite.name}" удалён` };
    }
    
}
