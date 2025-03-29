import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestRunEntity } from './test-runs.entity';
import { Repository, In, DeepPartial } from 'typeorm';
import { CreateTestRunsDto } from './dto/create-test-runs.dto'; 
import { TestCaseEntity } from 'src/test-cases/test-cases.entity';
import { UpdateTestRunsDto } from './dto/update-test-runs.dto';
import { TestRunStatus } from './test-runs.entity';
import { TestSuiteEntity } from 'src/test-suite/test-suite.entity';

@Injectable()
export class TestRunsService {
    constructor(
        @InjectRepository(TestRunEntity) private testRunsRepository: Repository<TestRunEntity>,
        @InjectRepository(TestCaseEntity) private testCasesRepository: Repository<TestCaseEntity>,
        @InjectRepository(TestSuiteEntity) private testSuitesRepository: Repository<TestSuiteEntity>,
    ) {}

    async getAllTestRuns(projectId: number): Promise<TestRunEntity[]> {
        return this.testRunsRepository
            .createQueryBuilder("testRun")
            .leftJoinAndSelect("testRun.testCases", "testCase")
            .leftJoinAndSelect("testCase.testSuite", "testSuite")
            .leftJoinAndSelect("testSuite.project", "project")
            .where("project.id = :projectId", { projectId })
            .getMany();
    }
    

    async getTestRunById(testRunId: number): Promise<TestRunEntity> {
        return this.testRunsRepository.findOne({
            where: { id: testRunId },
            relations: ['testCases'],
        });
    }    

    async createEmptyTestRun(title: string, description: string): Promise<TestRunEntity> {
        const testRun = this.testRunsRepository.create({
            title,
            description,
            status: TestRunStatus.ONWORK,
            executionTime: 0,
            testCases: [],
        });

        return this.testRunsRepository.save(testRun);
    }

    async addTestCaseToRun(testRunId: number, testCaseId: number): Promise<TestRunEntity> {
        const testRun = await this.testRunsRepository.findOne({ where: { id: testRunId }, relations: ['testCases'] });
        if (!testRun) {
            throw new NotFoundException('Тест-ран не найден');
        }

        const testCase = await this.testCasesRepository.findOne({ where: { id: testCaseId } });
        if (!testCase) {
            throw new NotFoundException('Тест-кейс не найден');
        }

        // Добавляем тест-кейс, если его ещё нет в тест-ране
        if (!testRun.testCases.some(tc => tc.id === testCase.id)) {
            testRun.testCases.push(testCase);
        }

        return this.testRunsRepository.save(testRun);
    }

    async createTestRunWithCases(body: CreateTestRunsDto, projectId: number): Promise<TestRunEntity> {
        let testSuite: TestSuiteEntity | null = null;
        let testCases: TestCaseEntity[] = [];

        if (body.testSuiteId) {
            testSuite = await this.testSuitesRepository.findOne({
                where: { id: body.testSuiteId, project: { id: projectId } },
            });

            if (!testSuite) {
                throw new NotFoundException(`Тест-сьют с ID ${body.testSuiteId} не найден или не принадлежит проекту`);
            }
        }

        if (body.testCaseIds && body.testCaseIds.length > 0) {
            testCases = await this.testCasesRepository.find({
                where: { id: In(body.testCaseIds), testSuite: { project: { id: projectId } } },
            });

            if (testCases.length !== body.testCaseIds.length) {
                throw new NotFoundException('Некоторые тест-кейсы не найдены или не принадлежат проекту');
            }
        }

        const testRun = this.testRunsRepository.create({
            title: body.title,
            description: body.description,
            status: body.status || TestRunStatus.ONWORK,
            executionTime: body.executionTime || 0,
        });

        await this.testRunsRepository.save(testRun);

        if (testSuite) {
            await this.testRunsRepository
                .createQueryBuilder()
                .relation(TestRunEntity, "testSuite")
                .of(testRun.id)
                .set(testSuite.id);
        }

        if (testCases.length > 0) {
            await this.testRunsRepository
                .createQueryBuilder()
                .relation(TestRunEntity, "testCases")
                .of(testRun.id)
                .add(testCases.map(tc => tc.id));
        }

        return this.testRunsRepository.findOne({
            where: { id: testRun.id },
            relations: ['testSuite', 'testCases'],
        });
    }
    
    async updateTestRuns(id: number, body: UpdateTestRunsDto): Promise<TestRunEntity> {
        const testRun = await this.testRunsRepository.findOne({
            where: { id },
            relations: ['testCases', 'testCases.testSuite.project'],
        });

        if (!testRun) {
            throw new NotFoundException('Тест-ран не найден');
        }

        if (body.testCaseIds) {
            const testCases = await this.testCasesRepository.find({
                where: { id: In(body.testCaseIds), testSuite: { project: { id: testRun.testCases[0]?.testSuite.project.id } } },
            });

            if (testCases.length !== body.testCaseIds.length) {
                throw new NotFoundException('Некоторые тест-кейсы не найдены или не относятся к проекту');
            }

            testRun.testCases = testCases;
        }

        Object.assign(testRun, body);
        return this.testRunsRepository.save(testRun);
    }

    async deleteTestRuns(id: number): Promise<{ message: string; id: number }> {
        const result = await this.testRunsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Тест-ран не найден');
        }
        return { message: 'Тест-ран удален', id };
    }

    async updateTestCaseStatus(testCaseId: number, status: string): Promise<TestCaseEntity> {
        const testCase = await this.testCasesRepository.findOne({ where: { id: testCaseId } });
        if (!testCase) throw new NotFoundException(`Тест-кейс с ID=${testCaseId} не найден`);

        testCase.status = status;
        return this.testCasesRepository.save(testCase);
    }

    async completeTestRun(testRunId: number): Promise<TestRunEntity> {
        const testRun = await this.testRunsRepository.findOne({ where: { id: testRunId } });
        if (!testRun) throw new NotFoundException(`Тест-ран с ID=${testRunId} не найден`);
    
        testRun.status = "COMPLETED";
        return this.testRunsRepository.save(testRun);
    }    
}
