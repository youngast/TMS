import { Controller } from '@nestjs/common';
import {Post,Get,Body} from '@nestjs/common';
import { TestSuiteService } from './test-suite.service';
import { CreateTestSuiteDto } from './dto/create-test-suite.dto';

@Controller('test-suite')
export class TestSuiteController {

    constructor(
        private testSuiteService: TestSuiteService
    ){}

    @Post()
    async createTestSuite(@Body() body: CreateTestSuiteDto) {
        return this.testSuiteService.createTestSuite(body);
    }

    @Get()
    async findAllTestSuite(){
        return this.testSuiteService.findAllTestSuite();
    }

}
