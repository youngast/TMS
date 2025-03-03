import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { UserEntity } from '../users/users.entity';
import { TestSuiteEntity } from '../test-suite/test-suite.entity';
import { ProjectMemberEntity } from './project-member.entity';

@Entity()
export class ProjectEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column({nullable:true})
    description:string;

    @ManyToOne(() => UserEntity, (user) => user.projects, { onDelete: 'CASCADE', eager: true })
    owner: UserEntity;    

    @OneToMany(() => TestSuiteEntity, (testSuite) => testSuite.project, { cascade: true })
    testSuites: TestSuiteEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(()=> ProjectMemberEntity, (member) => member.project, {cascade: true})
    members: ProjectMemberEntity[];
}