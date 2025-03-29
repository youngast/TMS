import { Module } from '@nestjs/common';
import { TestCasesController } from './test-cases.controller';
import { TestCasesService } from './test-cases.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestCaseEntity } from './test-cases.entity';
import { TestSuiteEntity } from '../test-suite/test-suite.entity';
import { TestSuiteModule } from '../test-suite/test-suite.module';
import { TestRunEntity } from 'src/test-runs/test-runs.entity';
import { TestRunsService } from 'src/test-runs/test-runs.service';
import { TestRunsModule } from 'src/test-runs/test-runs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestCaseEntity, TestSuiteEntity, TestRunEntity]),TestRunsModule 
  ],
  controllers: [TestCasesController],
  providers: [TestCasesService, TestRunsService],
  exports: [TestCasesService, TypeOrmModule],
})
export class TestCasesModule {}
