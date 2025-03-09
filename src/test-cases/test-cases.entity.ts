import { TestSuiteEntity } from 'src/test-suite/test-suite.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { TestRunEntity } from 'src/test-runs/test-runs.entity';

@Entity('test_cases')
export class TestCaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  steps: string;

  @Column({ type: 'text', nullable: true })
  expectedResult?: string;

  @Column({ default: 'new' })
  status: string; 

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => TestSuiteEntity, (testSuite) => testSuite.testCases, { onDelete: 'CASCADE' })
  testSuite: TestSuiteEntity;

  @OneToMany(() => TestRunEntity, (testRun) => testRun.testCase, { onDelete: 'CASCADE' })
  testRuns: TestRunEntity[];

}
