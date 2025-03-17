import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn } from 'typeorm';
import { TestCaseEntity } from 'src/test-cases/test-cases.entity';


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

    @ManyToMany(() => TestCaseEntity)
    @JoinTable()
    testCases: TestCaseEntity[];
}