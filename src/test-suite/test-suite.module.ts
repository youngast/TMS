import { Module } from '@nestjs/common';
import { TestSuiteController } from './test-suite.controller';
import { TestSuiteService } from './test-suite.service';
import { TestSuiteEntity } from './test-suite.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestCaseEntity } from '../test-cases/test-cases.entity';
import { TestRunEntity } from 'src/test-runs/test-runs.entity';
// import { TestRunEntity } from 'src/test-runs/test-runs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestSuiteEntity, TestCaseEntity])], 
  controllers: [TestSuiteController],
  providers: [TestSuiteService],
  exports: [TestSuiteService, TypeOrmModule],
})
export class TestSuiteModule {}
