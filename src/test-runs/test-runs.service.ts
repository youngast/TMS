import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestRunEntity } from './test-runs.entity';
import { Repository } from 'typeorm';
import { CreateTestRunsDto } from './dto/create-test-runs.dto';
import { TestCaseEntity } from 'src/test-cases/test-cases.entity';
import { UpdateTestRunsDto } from './dto/update-test-runs.dto';
import { TestSuiteEntity } from 'src/test-suite/test-suite.entity';
import { ProjectEntity } from 'src/projects/projects.entity';
import { TestRunStatus } from './test-runs.entity';

@Injectable()
export class TestRunsService {

    constructor(
        @InjectRepository (TestRunEntity) private testRunsRepository: Repository<TestRunEntity>,
        @InjectRepository (TestCaseEntity) private testCasesRepository: Repository<TestCaseEntity>,
        @InjectRepository (TestSuiteEntity) private testSuitRepository: Repository<TestSuiteEntity>,
        @InjectRepository (ProjectEntity) private projectRepository: Repository<ProjectEntity>,
    ){}


    getallTestRuns(projectId: number): Promise<TestRunEntity[]> {
        return this.testRunsRepository.find({
            where: { testCase: { testSuite: { project: { id: projectId } } } },
            relations: ['testCase', 'testCase.testSuite']
        });
    }

    async getTestRunsByCaseId(testSuiteId: number, testCaseId: number) {
        return this.testRunsRepository.find({
          where: { testCase: { id: testCaseId }, testSuite: { id: testSuiteId } },
          relations: ["testCase"],
        });
      }


    async createTestRuns(body: CreateTestRunsDto, testSuiteId: number, testCaseId: number) {
        const testCase = await this.testCasesRepository.findOne({ where: { id: testCaseId } });
        if (!testCase) {
          throw new NotFoundException("Тест-кейс не найден");
        }
    
        const testRun = this.testRunsRepository.create({
          testCase,
          testSuite: { id: testSuiteId } as TestSuiteEntity,
          title: body.title,
          description: body.description,
          status: TestRunStatus.ONWORK,
          executionTime: body.executionTime || 0,
        });
    
        return this.testRunsRepository.save(testRun);
      }
        
    async updateTestRuns(id: number, body: UpdateTestRunsDto): Promise<TestRunEntity> {
        const testRun = await this.testRunsRepository.findOne({where: {id}});
        if(!testRun){
            throw new NotFoundException('Тест-рана нет');
        }

        if(body.testCaseId){
            const testCase = await this.testCasesRepository.findOne({where: {id: body.testCaseId}});
            if(!testCase){
                throw new NotFoundException('Тест кейса нет')
            }
            testRun.testCase = testCase;
        }

        Object.assign(testRun, body);
        return this.testRunsRepository.save(testRun);
    }

    async deleteTestRuns(id: number): Promise<{message: string, id:number}> {
        const testRun = await this.testRunsRepository.findOne({where: {id}});
        if(!testRun){
            throw new NotFoundException('Тест-рана нет');
        }
        await this.testRunsRepository.remove(testRun);
        return {message: 'Тест run удален', id:testRun.id };
    }

}
