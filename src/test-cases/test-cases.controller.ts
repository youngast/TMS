import { Controller,Get,Post,Patch,Delete,Body,Param } from '@nestjs/common';
import { TestCasesService } from './test-cases.service';
import { CreateTestCaseDto } from './dto/create-test-cases.dto';
import { UpdateTestCaseDto } from './dto/update-test-cases.dto';

@Controller('test-cases')
export class TestCasesController {

    constructor(
        private testCasesService: TestCasesService
    ){}

    @Get()
    findAll(){
        return this.testCasesService.findallTestCase();
    }

    @Get(':id')
    findById(@Param(':id') id:string){
        return this.testCasesService.findoneTestCase(+id);
    }

    @Post()
    create(@Body() body:CreateTestCaseDto){
        return this.testCasesService.createTestCase(body);
    }

    @Patch(':id')
    update(@Param(':id') id:string,@Body() body:UpdateTestCaseDto){
        return this.testCasesService.updateTestCase(+id, body);
    }

    @Delete(':id')
    delete(@Param(':id') id:string){
        return this.testCasesService.deleteTestCase(+id);
    }

}
