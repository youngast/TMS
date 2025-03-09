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
    async createTestCase(body: CreateTestCaseDto, testSuiteId: number) {
        const testSuite = await this.testSuitesRepository.findOne({ where: { id: testSuiteId } });
        if (!testSuite) {
          throw new NotFoundException("Тест-сьют не найден");
        }
    
        const testCase = this.testCasesRepository.create({
          ...body,
          testSuite,
        });
    
        return this.testCasesRepository.save(testCase);
      }
    
    async findallTestCase(suiteId: number): Promise<TestCaseEntity[]> {
        if (!suiteId || isNaN(suiteId)) {
            throw new NotFoundException("Некорректный ID тест-сьюта");
          }
          
          const testCases = await this.testCasesRepository.find({
            where: { testSuite: { id: suiteId } },
            relations: ["testSuite"],
          });
      
          if (testCases.length === 0) {
            throw new NotFoundException("Тест-кейсы не найдены для этого тест-сьюта");
          }
      
          return testCases;
      
    }

    async getTestCasesBySuiteId(testSuiteId: number) {
        return this.testCasesRepository.find({
          where: { testSuite: { id: testSuiteId } },
          relations: ["testSuite"],
        });
      }
      

    // async updateTestCase(id: number, body: UpdateTestCaseDto): Promise<TestCaseEntity> {
    //     const testCase = await this.getTestCasesBySuiteId(id);
    
    //     // Если передан testSuiteId, обновляем связь с тест-сьютом
    //     if (body.testSuiteId) {
    //         const testSuite = await this.testSuitesRepository.findOne({ where: { id: body.testSuiteId } });
    //         if (!testSuite) {
    //             throw new NotFoundException(`Тест-сьют с id ${body.testSuiteId} не найден`);
    //         }
    //         testCase.testSuite = testSuite;
    //     }
    
    //     Object.assign(testCase, body);
    //     return this.testCasesRepository.save(testCase);
    // }
    

    // async deleteTestCase(id:number): Promise<{message:string}> {
    //     const testcase = await this.getTestCasesBySuiteId(id);

    //     await this.testCasesRepository.remove(testcase);

    //     return {message: `${testcase.title} удален`};
    // }

}
