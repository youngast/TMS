import { Controller, Get, Post, Body, Delete, Param, Patch, NotFoundException } from '@nestjs/common';
import { TestRunsService } from './test-runs.service';
import { CreateTestRunsDto } from './dto/create-test-runs.dto';
import { UpdateTestRunsDto } from './dto/update-test-runs.dto';

@Controller('test-suites/:testSuiteId/test-cases/:testCaseId/test-runs')
export class TestRunsController {

    constructor(
        private testRunsService: TestRunsService
    ){

    }

    @Get()
    getallTestRuns(@Param('projectId') projectId: string) {
        return this.testRunsService.getallTestRuns(+projectId);
    }

    @Post()
    async createTestRun(
      @Param("testSuiteId") testSuiteId: string,
      @Param("testCaseId") testCaseId: string,
      @Body() body: CreateTestRunsDto
    ) {
      if (!testSuiteId || isNaN(+testSuiteId) || !testCaseId || isNaN(+testCaseId)) {
        throw new NotFoundException("Некорректный ID тест-сьюта или тест-кейса");
      }
  
      return this.testRunsService.createTestRuns(body, +testSuiteId, +testCaseId);
    }
  
    @Get()
    async getTestRuns(
      @Param("testSuiteId") testSuiteId: string,
      @Param("testCaseId") testCaseId: string,
    ) {
      console.log(`📡 Запрос тест-ранов для testSuiteId=${testSuiteId}, testCaseId=${testCaseId}`);
      const testRuns = await this.testRunsService.getTestRunsByCaseId(+testSuiteId, +testCaseId);
      if (!testRuns || testRuns.length === 0) {
        throw new NotFoundException(`❌ Тест-раны для testSuiteId=${testSuiteId}, testCaseId=${testCaseId} не найдены`);
      }
      return testRuns;
    }

    @Patch(':id')
    patchTestRuns(@Param('id') id:string,@Body() body:UpdateTestRunsDto) {
        return this.testRunsService.updateTestRuns(+id, body);
    }

    @Delete(':id')
    deleteTestRuns(@Param('id') id:string) {
        return this.testRunsService.deleteTestRuns(+id);
    }

}
