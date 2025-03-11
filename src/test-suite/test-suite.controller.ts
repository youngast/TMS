import { BadRequestException, Controller, Delete, Patch, Put } from '@nestjs/common';
import {Post,Get,Body, Param} from '@nestjs/common';
import { TestSuiteService } from './test-suite.service';
import { CreateTestSuiteDto } from './dto/create-test-suite.dto';

@Controller('projects/:projectId/test-suites')
export class TestSuiteController {

    constructor(
        private testSuiteService: TestSuiteService
    ){}

    @Post()
    async createTestSuite(@Body() body: CreateTestSuiteDto, @Param('projectId') projectId: string){ {
        return this.testSuiteService.createTestSuite(body, +projectId);
    }
}

    @Get()
    async findAllTestSuite(@Param('projectId') projectId: string){
        return this.testSuiteService.findAllTestSuite(+projectId);
    }


    @Delete(':id')
    async deleteTestSuite(@Param('id') id:string){
        return this.testSuiteService.deleteTestSuite(+id);
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
    async updateTestSuite(@Param('projectId') projectId: string, @Param('id') id: string, @Body() body: CreateTestSuiteDto) {
        console.log(`🔹 Обновление тест-сьюта ID: ${id} в проекте ID: ${projectId}`);
        return this.testSuiteService.updateTestSuite(+id, +projectId, body);
    }
    

}
