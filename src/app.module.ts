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
import { ProjectMemberEntity } from './projects/project-member.entity';


@Module({
  imports: [UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'h@#W1Gs6u',
      database: 'tms_db',
      synchronize: true,
      entities: [UserEntity, TestCaseEntity, TestSuiteEntity, TestRunEntity, ProjectEntity, ProjectMemberEntity]
    }),
    AuthModule,
    ProjectsModule,
    TestCasesModule,
    TestRunsModule,
    TestSuiteModule,
  ],
})
export class AppModule {}
