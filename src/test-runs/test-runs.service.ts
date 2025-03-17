import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestRunEntity } from './test-runs.entity';
import { Repository, In } from 'typeorm';
import { CreateTestRunsDto } from './dto/create-test-runs.dto'; 
import { TestCaseEntity } from 'src/test-cases/test-cases.entity';
import { UpdateTestRunsDto } from './dto/update-test-runs.dto';
import { TestRunStatus } from './test-runs.entity';

@Injectable()
export class TestRunsService {
    constructor(
        @InjectRepository(TestRunEntity) private testRunsRepository: Repository<TestRunEntity>,
        @InjectRepository(TestCaseEntity) private testCasesRepository: Repository<TestCaseEntity>,
    ) {}

    async getAllTestRuns(projectId: number): Promise<TestRunEntity[]> {
        return this.testRunsRepository.find({
            where: { testCases: { testSuite: { project: { id: projectId } } } },
            relations: ['testCases', 'testCases.testSuite'],
        });
    }

    async getTestRunsByCaseId(testCaseId: number) {
        return this.testRunsRepository.find({
            where: { testCases: { id: testCaseId } },
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

    async createTestRunWithCases(body: CreateTestRunsDto, projectId: number) {
        if (!body.testSuiteId && (!body.testCaseIds || body.testCaseIds.length === 0)) {
            throw new NotFoundException('Нужно выбрать testSuiteId или testCaseIds');
        }

        if (body.testSuiteId && body.testCaseIds) {
            throw new NotFoundException('Выберите либо testSuiteId, либо testCaseIds, но не оба');
        }

        const testCases = body.testCaseIds
            ? await this.testCasesRepository.find({
                  where: { id: In(body.testCaseIds), testSuite: { project: { id: projectId } } },
              })
            : await this.testCasesRepository.find({
                  where: { testSuite: { id: body.testSuiteId, project: { id: projectId } } },
              });

        if (testCases.length === 0) {
            throw new NotFoundException('Тест-кейсы не найдены или не относятся к проекту');
        }

        // ✅ Создаём один тест-ран и привязываем к нему все тест-кейсы
        const testRun = this.testRunsRepository.create({
            title: body.title,
            description: body.description,
            status: body.status || TestRunStatus.ONWORK,
            executionTime: body.executionTime || 0,
            testCases,
        });

        return this.testRunsRepository.save(testRun);
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
}
