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
    async getTestCases(@Param("testSuiteId") testSuiteId: string) {
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
  
    // @Patch(':id')
    // update(@Param('id') id:string,@Body() body:UpdateTestCaseDto){
    //     return this.testCasesService.updateTestCase(+id, body);
    // }

    // @Delete(':testCaseId')
    // delete(
    //     @Param('projectId' ) projectId: string,
    //     @Param('testSuiteId' ) testSuiteId: string,
    //     @Param('testCaseId' ) testCaseId: string

    // ){
    //     if (isNaN(+projectId) || isNaN(+testSuiteId) || isNaN(+testCaseId)) {
    //         throw new Error('Один из параметров в URL не является числом');
    //     }

    //     return this.testCasesService.deleteTestCase(+testCaseId);
    // }

}
