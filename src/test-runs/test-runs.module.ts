import { Module } from '@nestjs/common';
import { TestRunsController } from './test-runs.controller';
import { TestRunsService } from './test-runs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestCaseEntity } from 'src/test-cases/test-cases.entity';
import { TestRunEntity } from './test-runs.entity';
import { TestSuiteEntity } from 'src/test-suite/test-suite.entity';
import { ProjectEntity } from 'src/projects/projects.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestRunEntity, TestCaseEntity, TestSuiteEntity, ProjectEntity])],
  controllers: [TestRunsController],
  providers: [TestRunsService],
  exports: [TestRunsService]
})
export class TestRunsModule {}
