import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestCaseEntity } from './test-cases.entity';
import { Repository } from 'typeorm';
import { CreateTestCaseDto } from './dto/create-test-cases.dto';
import { UpdateTestCaseDto } from './dto/update-test-cases.dto';
import { TestSuiteEntity } from 'src/test-suite/test-suite.entity';

@Injectable()
export class TestCasesService {

    constructor
        (@InjectRepository(TestCaseEntity) private testCasesRepository: Repository<TestCaseEntity>,
         @InjectRepository(TestSuiteEntity) private testSuitesRepository: Repository<TestSuiteEntity>
        )
    {}


    // Создать тест кейс
    async createTestCase(body:CreateTestCaseDto, projectId: number, testSuiteId: number): Promise<TestCaseEntity> {
        const testSuite = await this.testSuitesRepository.findOne({
            where:{project:{id: projectId}, id: testSuiteId},
            relations: ['project']
        })
        if(!testSuite){
            throw new NotFoundException('Нет тест-сьют')
        }

        const testcase = this.testCasesRepository.create({
            title: body.title,
            description:body.description,
            steps: body.steps,
            expectedResult: body.expectedResult,
            status: body.status,
            testSuite
        });
        return this.testCasesRepository.save(testcase);
    }

    findallTestCase(projectId: number): Promise<TestCaseEntity[]> {
        return this.testCasesRepository.find({
            where: { testSuite: { project: { id: projectId } } },
            relations: ['testSuite']
        });
    }

    async findoneTestCase(id: number): Promise<TestCaseEntity> {
        const testCase = await this.testCasesRepository.findOne({
            where: { id },
            relations: ['testSuite','testSuite.project'],
        });
    
        if (!testCase) {
            throw new NotFoundException('Тест-кейса нет');
        }
    
        return testCase;
    }
    

    async updateTestCase(id: number, body: UpdateTestCaseDto): Promise<TestCaseEntity> {
        const testCase = await this.findoneTestCase(id);
    
        // Если передан testSuiteId, обновляем связь с тест-сьютом
        if (body.testSuiteId) {
            const testSuite = await this.testSuitesRepository.findOne({ where: { id: body.testSuiteId } });
            if (!testSuite) {
                throw new NotFoundException(`Тест-сьют с id ${body.testSuiteId} не найден`);
            }
            testCase.testSuite = testSuite;
        }
    
        Object.assign(testCase, body);
        return this.testCasesRepository.save(testCase);
    }
    

    async deleteTestCase(id:number): Promise<{message:string}> {
        const testcase = await this.findoneTestCase(id);

        await this.testCasesRepository.remove(testcase);

        return {message: `${testcase.title} удален`};
    }

}
