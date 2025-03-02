import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { TestCaseEntity } from 'src/test-cases/test-cases.entity';
import { IsEnum } from 'class-validator';
import { TestSuiteEntity } from 'src/test-suite/test-suite.entity';

export enum TestRunStatus {
        PASSED = 1,
        FAILED = 2,
        SKIPPED = 3,
        ONWORK = 4,
    }


@Entity()
export class TestRunEntity {

    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    title:string;

    @Column()
    description:string;

    @ManyToOne(() => TestCaseEntity, (testCase) => testCase.testRuns, { onDelete: 'CASCADE' })
    testCase: TestCaseEntity;

    @ManyToOne(() => TestSuiteEntity, (testSuit) => testSuit.testRuns, { onDelete: 'CASCADE' })
    testSuite: TestSuiteEntity;
    
    @Column({ type: 'integer' })
    @IsEnum(TestRunStatus)
    status: TestRunStatus;
  
    @Column({ type: 'float' })
    executionTime: number;
  
    @CreateDateColumn()
    createdAt: Date;  
    
}