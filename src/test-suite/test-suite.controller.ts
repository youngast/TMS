import { BadRequestException, Controller, Delete } from '@nestjs/common';
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

}
