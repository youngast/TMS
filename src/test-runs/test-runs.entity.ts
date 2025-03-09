import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { TestCaseEntity } from 'src/test-cases/test-cases.entity';
import { IsEnum } from 'class-validator';
import { TestSuiteEntity } from 'src/test-suite/test-suite.entity';

export enum TestRunStatus {
    PASSED = "PASSED",
    FAILED = "FAILED",
    SKIPPED = "SKIPPED",
    ONWORK = "ONWORK",
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
    
    @Column({ type: 'enum', enum: TestRunStatus, default: TestRunStatus.ONWORK })
    @IsEnum(TestRunStatus)
    status: TestRunStatus;
    
    @Column({ type: 'float' })
    executionTime: number;
  
    @CreateDateColumn()
    createdAt: Date;  
    
}