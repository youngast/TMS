import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestRunEntity } from './test-runs.entity';
import { Repository } from 'typeorm';
import { CreateTestRunsDto } from './dto/create-test-runs.dto';
import { TestCaseEntity } from 'src/test-cases/test-cases.entity';
import { UpdateTestRunsDto } from './dto/update-test-runs.dto';
import { TestSuiteEntity } from 'src/test-suite/test-suite.entity';

@Injectable()
export class TestRunsService {

    constructor(
        @InjectRepository (TestRunEntity) private testRunsRepository: Repository<TestRunEntity>,
        @InjectRepository (TestCaseEntity) private testCasesRepository: Repository<TestCaseEntity>,
        @InjectRepository (TestSuiteEntity) private testSuitRepository: Repository<TestSuiteEntity>
    ){}


    getallTestRuns(): Promise<TestRunEntity[]> {
        return this.testRunsRepository.find({relations: ['testCase','testCase.testSuite']});
    }

    async getoneTestRuns(id: number): Promise<TestRunEntity> {
        const testRun = await this.testRunsRepository.findOne({where: {id}, relations: ['testCase','testCase.testSuite']});

        if(!testRun){
            throw new NotFoundException('Тест-рана нет');
        }
        return testRun;

    }


    async createTestRuns(body: CreateTestRunsDto): Promise<TestRunEntity> {
        
        const testCase = await this.testCasesRepository.findOne({where: {id: body.testCaseId}});
        if(!testCase){
            throw new NotFoundException('Тест-кейса нет');
        }

        const testRun = this.testRunsRepository.create({
            testCase,
            title: body.title,
            description: body.description,
            status: body.status,
            executionTime: body.executionTime
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
