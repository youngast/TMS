import { Module } from '@nestjs/common';
import { TestCasesController } from './test-cases.controller';
import { TestCasesService } from './test-cases.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestCaseEntity } from './test-cases.entity';
import { TestSuiteEntity } from '../test-suite/test-suite.entity';
import { TestSuiteModule } from '../test-suite/test-suite.module';
import { TestRunEntity } from 'src/test-runs/test-runs.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestCaseEntity, TestSuiteEntity]), 
  ],
  controllers: [TestCasesController],
  providers: [TestCasesService],
  exports: [TestCasesService, TypeOrmModule],
})
export class TestCasesModule {}
