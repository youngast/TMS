import { Controller,Get,Post,Patch,Delete,Body,Param } from '@nestjs/common';
import { TestCasesService } from './test-cases.service';
import { CreateTestCaseDto } from './dto/create-test-cases.dto';
import { UpdateTestCaseDto } from './dto/update-test-cases.dto';

@Controller('projects/:projectId/test-suites/:testSuiteId/test-cases')
export class TestCasesController {

    constructor(
        private testCasesService: TestCasesService
    ){}

    @Get()
    findAll(@Param('projectId') projectId: string){
        return this.testCasesService.findallTestCase(+projectId);;
    }

    @Get(':testCaseId')
    async getTestCaseById(
        @Param('projectId' ) projectId: string,
        @Param('testSuiteId' ) testSuiteId: string,
        @Param('testCaseId' ) testCaseId: string
    ) {
        if (isNaN(+projectId) || isNaN(+testSuiteId) || isNaN(+testCaseId)) {
            throw new Error('Один из параметров в URL не является числом');
        }
        
        return this.testCasesService.findoneTestCase(+testCaseId);
    }

    @Post()
    create(@Body() body:CreateTestCaseDto, @Param('projectId') projectId: string, @Param('testSuiteId') testSuiteId: string){
        return this.testCasesService.createTestCase(body, +projectId, +testSuiteId);
    }

    @Patch(':id')
    update(@Param('id') id:string,@Body() body:UpdateTestCaseDto){
        return this.testCasesService.updateTestCase(+id, body);
    }

    @Delete(':testCaseId')
    delete(
        @Param('projectId' ) projectId: string,
        @Param('testSuiteId' ) testSuiteId: string,
        @Param('testCaseId' ) testCaseId: string

    ){
        if (isNaN(+projectId) || isNaN(+testSuiteId) || isNaN(+testCaseId)) {
            throw new Error('Один из параметров в URL не является числом');
        }

        return this.testCasesService.deleteTestCase(+testCaseId);
    }

}
