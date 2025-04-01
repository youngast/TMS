import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestCaseEntity } from './test-cases.entity';
import { ILike, Repository } from 'typeorm';
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
    async createTestCase(body: CreateTestCaseDto, testSuiteId: number): Promise<TestCaseEntity> {
      const testSuite = await this.testSuitesRepository.findOne({ where: { id: testSuiteId } });
      if (!testSuite) {
        throw new NotFoundException("Тест-сьют не найден");
      }
  
      const testCase = this.testCasesRepository.create({
        ...body,
        testSuite,
        status: body.status || 'new',
      });

      return this.testCasesRepository.save(testCase);
    }

    async getTestCaseById(id: number): Promise<TestCaseEntity> {
      const testCase = await this.testCasesRepository.findOne({
        where: { id },
        relations: ["testSuite"],
      });
  
      if (!testCase) {
        throw new NotFoundException(`Тест-кейс с id=${id} не найден`);
      }
  
      return testCase;
    }

    async getTestCasesBySuiteId(testSuiteId: number): Promise<TestCaseEntity[]> {
      if (!testSuiteId || isNaN(testSuiteId)) {
          throw new NotFoundException("Некорректный ID тест-сьюта");
      }
      
      const testCases = await this.testCasesRepository.find({
          where: { testSuite: { id: testSuiteId } },
          relations: ["testSuite"],
      });
  
      if (testCases.length === 0) {
          throw new NotFoundException("Тест-кейсы не найдены для этого тест-сьюта");
      }
  
      return testCases;
  }
  
  async updateTestCase(id: number, body: UpdateTestCaseDto): Promise<TestCaseEntity> {
    const testCase = await this.getTestCaseById(id);

    Object.assign(testCase, body);
    return this.testCasesRepository.save(testCase);
  }

  async deleteTestCase(id: number): Promise<{ message: string }> {
    const testCase = await this.getTestCaseById(id);
    await this.testCasesRepository.remove(testCase);

    return { message: `Тест-кейс "${testCase.title}" удален` };
  }

  async searchTestCase(searchTerm: string): Promise<TestCaseEntity[]> {
    return this.testCasesRepository.find({
      where: [
        { title: ILike(`%${searchTerm}%`) },
        { description: ILike(`%${searchTerm}%`) },
      ],
    });
  }

}
