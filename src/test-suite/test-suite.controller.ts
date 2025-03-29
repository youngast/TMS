import { BadRequestException, Controller, Delete, Patch, Put } from '@nestjs/common';
import {Post,Get,Body, Param} from '@nestjs/common';
import { TestSuiteService } from './test-suite.service';
import { CreateTestSuiteDto } from './dto/create-test-suite.dto';
import { TestRunsService } from '../test-runs/test-runs.service'; 

@Controller('projects/:projectId/test-suites')
export class TestSuiteController {

    constructor(
        private testSuiteService: TestSuiteService,
        private testRunsService: TestRunsService,
    ){}

    @Post()
    async createTestSuite(@Body() body: CreateTestSuiteDto, @Param('projectId') projectId: string){ {
        return this.testSuiteService.createTestSuite(body, +projectId);
    }
    }

    @Get()
    async searchTestSuites(@Param('projectId') projectId: string, @Param('search') search: string) {
        return this.testSuiteService.searchTestSuites(+projectId, search);
    }

    @Get()
    async findAllTestSuite(@Param('projectId') projectId: string){
        return this.testSuiteService.findAllTestSuite(+projectId);
    }
      
    @Get(':id')
    async findOneTestSuite(
        @Param('id') id:string,
    ){
        return this.testSuiteService.findOneTestSuite(+id);
    }

    @Get(':id')
    async findTestSuiteByProjectId(@Param('projectId') projectId: string){
        return this.testSuiteService.findTestSuiteByProjectId(+projectId);
    }

    @Patch(':id')
    async updateTestSuite(@Param('projectId') projectId: string, @Param('id') id: string,@Body() body: CreateTestSuiteDto) {
    console.log(`Обновление тест-сьюта ${id} в проекте ${projectId}`);
    
      return this.testSuiteService.updateTestSuite(+projectId, +id, body);
    }

    @Delete(':id')
    async deleteTestSuite(@Param('projectId') projectId: string, @Param('id') id: string){
    console.log(`Удаление тест-сьюта ${id} в проекте ${projectId}`);

        return this.testSuiteService.deleteTestSuite(+projectId, +id);
    }  

    @Get(':id/test-runs')
    async getTestRunsByTestSuite(@Param('id') testSuiteId: string) {
        return this.testRunsService.getTestRunById(+testSuiteId);
    }
}
