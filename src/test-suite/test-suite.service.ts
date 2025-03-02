import { Injectable, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTestSuiteDto } from './dto/create-test-suite.dto';
import { TestSuiteEntity } from './test-suite.entity';


@Injectable()
export class TestSuiteService {

    constructor(
        @InjectRepository(TestSuiteEntity) private testSuiteRepository: Repository<TestSuiteEntity>
    ){

    }

    async findAllTestSuite(): Promise<TestSuiteEntity[]>{
        return this.testSuiteRepository.find({relations: ['testCases']});
        
    }


    async createTestSuite(body: CreateTestSuiteDto): Promise<TestSuiteEntity> {
        const testSuite = await this.testSuiteRepository.create(body);
        return this.testSuiteRepository.save(testSuite);
    }


}
