import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, ManyToOne } from 'typeorm';
import { TestCaseEntity } from 'src/test-cases/test-cases.entity';
import { TestSuiteEntity } from 'src/test-suite/test-suite.entity';


export enum TestRunStatus {
  PASSED = "PASSED",
  FAILED = "FAILED",
  SKIPPED = "SKIPPED",
  ONWORK = "ONWORK",
}

@Entity('test_runs')
export class TestRunEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: 'ONWORK' })
    status: string;

    @Column({ default: 0 })
    executionTime: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => TestSuiteEntity, (testSuite) => testSuite.testRuns, { nullable: true, onDelete: 'SET NULL' })
    testSuite: TestSuiteEntity;


    @ManyToMany(() => TestCaseEntity)
    @JoinTable()
    testCases: TestCaseEntity[];
}