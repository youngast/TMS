import { Controller, Get, Post, Body, Delete, Param, Patch } from '@nestjs/common';
import { TestRunsService } from './test-runs.service';
import { CreateTestRunsDto } from './dto/create-test-runs.dto';
import { UpdateTestRunsDto } from './dto/update-test-runs.dto';

@Controller('test-runs')
export class TestRunsController {

    constructor(
        private testRunsService: TestRunsService
    ){

    }

    @Get()
    getallTestRuns() {
        return this.testRunsService.getallTestRuns();
    }

    @Post()
    createTestRuns(@Body() body:CreateTestRunsDto){
        return this.testRunsService.createTestRuns(body);
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
