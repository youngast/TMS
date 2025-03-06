import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ProjectEntity} from './projects.entity';
import { TestSuiteEntity } from 'src/test-suite/test-suite.entity';
import { UserEntity } from 'src/users/users.entity';
import { TestCaseEntity } from 'src/test-cases/test-cases.entity';
import { TestRunEntity } from 'src/test-runs/test-runs.entity';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [TypeOrmModule.forFeature([ProjectEntity,
    TestSuiteEntity,
    TestCaseEntity,
    TestRunEntity,
    UserEntity])],
  exports: [ProjectsService, TypeOrmModule]
})
export class ProjectsModule {}
