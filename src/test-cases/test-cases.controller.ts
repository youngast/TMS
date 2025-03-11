import { Controller,Get,Post,Patch,Delete,Body,Param, NotFoundException } from '@nestjs/common';
import { TestCasesService } from './test-cases.service';
import { CreateTestCaseDto } from './dto/create-test-cases.dto';
import { UpdateTestCaseDto } from './dto/update-test-cases.dto';

@Controller('test-suites/:testSuiteId/test-cases')
export class TestCasesController {

    constructor(
        private testCasesService: TestCasesService
    ){}

    @Get()
    async getTestCases(@Param('testSuiteId') testSuiteId: string) {
      console.log(`⚡ Запрос на получение тест-кейсов для testSuiteId=${testSuiteId}`);
  
      const testCases = await this.testCasesService.getTestCasesBySuiteId(+testSuiteId);
  
      if (!testCases || testCases.length === 0) {
        throw new NotFoundException(`Тест-кейсы для testSuiteId=${testSuiteId} не найдены`);
      }
      
      return testCases;
    }

    @Post()
    async createTestCase(
      @Param("testSuiteId") testSuiteId: string,
      @Body() body: CreateTestCaseDto
    ) {
      console.log(`📡 Создание тест-кейса в testSuiteId=${testSuiteId}`);
      return this.testCasesService.createTestCase(body, +testSuiteId);
    }

    @Get(':id')
    async getTestCaseById(@Param('id') id: string) {
      console.log(`⚡ Запрос тест-кейса id=${id}`);
      return this.testCasesService.getTestCaseById(+id);
    }

    @Patch(':id')
    async updateTestCase(
      @Param('id') id: string,
      @Body() body: UpdateTestCaseDto,
    ) {
      console.log(`⚡ Обновление тест-кейса id=${id}`);
      return this.testCasesService.updateTestCase(+id, body);
    }
  
    @Delete(':id')
    async deleteTestCase(@Param('id') id: string) {
      console.log(`⚡ Удаление тест-кейса id=${id}`);
      return this.testCasesService.deleteTestCase(+id);
    }
    
}
