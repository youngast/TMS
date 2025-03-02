import { Column, OneToMany, PrimaryGeneratedColumn,Entity, ManyToOne } from "typeorm";
import { TestCaseEntity } from "src/test-cases/test-cases.entity";
import { ProjectEntity } from "src/projects/projects.entity";
import { TestRunEntity } from "src/test-runs/test-runs.entity";

@Entity()
export class TestSuiteEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => TestCaseEntity, (testCase) => testCase.testSuite, { cascade: true })
    testCases: TestCaseEntity[];

    @OneToMany(() => TestRunEntity, (testRun) => testRun.testSuite, { cascade: true })
    testRuns: TestRunEntity[];

    @ManyToOne(()=> ProjectEntity, (project) => project.testSuites, {onDelete: 'CASCADE'})
    project: ProjectEntity;
}