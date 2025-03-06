import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { UserEntity } from '../users/users.entity';
import { TestSuiteEntity } from '../test-suite/test-suite.entity';
import {Exclude} from 'class-transformer';

@Entity()
export class ProjectEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column({nullable:true})
    description:string;

    @ManyToOne(() => UserEntity, (user) => user.projects, { onDelete: 'CASCADE', eager: true })
    @Exclude()
    owner: UserEntity;    

    @OneToMany(() => TestSuiteEntity, (testSuite) => testSuite.project, { cascade: true })
    testSuites: TestSuiteEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @ManyToMany(()=> UserEntity, (user) => user.projects)
    @JoinTable()
    members: UserEntity[];
}