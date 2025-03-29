import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import {UserEntity} from './users/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { TestCasesModule } from './test-cases/test-cases.module';
import { TestRunsModule } from './test-runs/test-runs.module';
import { TestCaseEntity } from './test-cases/test-cases.entity';
import { TestSuiteModule } from './test-suite/test-suite.module';
import { TestSuiteEntity } from './test-suite/test-suite.entity';
import { TestRunEntity } from './test-runs/test-runs.entity';
import { ProjectEntity } from './projects/projects.entity';
import { TestRunsService } from './test-runs/test-runs.service';
import { TestRunsController } from './test-runs/test-runs.controller';
import { TestCasesController } from './test-cases/test-cases.controller';
// import { ProjectMemberEntity } from './projects/project-member.entity';


@Module({
  imports: [UsersModule,TestRunsModule, TestCasesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'h@#W1Gs6u',
      database: 'tms_db',
      synchronize: true,
      entities: [UserEntity, TestCaseEntity, TestSuiteEntity, TestRunEntity, ProjectEntity]
    }),
    AuthModule,
    ProjectsModule,
    TestCasesModule,
    TestRunsModule,
    TestSuiteModule,
  ],
  controllers: [TestRunsController, TestCasesController],
  providers: [TestRunsService],
})
export class AppModule {}
