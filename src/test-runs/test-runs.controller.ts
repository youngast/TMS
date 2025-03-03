import { Controller, Get, Post, Body, Delete, Param, Patch } from '@nestjs/common';
import { TestRunsService } from './test-runs.service';
import { CreateTestRunsDto } from './dto/create-test-runs.dto';
import { UpdateTestRunsDto } from './dto/update-test-runs.dto';

@Controller('projects/:projectId/test-suites/:testSuiteId/test-cases/:testCaseId/test-runs')
export class TestRunsController {

    constructor(
        private testRunsService: TestRunsService
    ){

    }

    @Get()
    getallTestRuns(projectId:string) {
        return this.testRunsService.getallTestRuns(+projectId);
    }

    @Post()

    createTestRuns(@Body() body:CreateTestRunsDto, @Param('projectId') projectId: string, @Param('testSuiteId') testSuiteId: string, @Param('testCaseId') testCaseId: string){
        return this.testRunsService.createTestRuns(body, +projectId, +testSuiteId, +testCaseId);
    }

    @Get(':id')
    getoneTestRuns(@Param('id') id:string) {
        return this.testRunsService.getoneTestRuns(+id);
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
