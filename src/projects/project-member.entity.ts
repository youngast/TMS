import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { UserEntity } from "src/users/users.entity";
import { ProjectEntity } from "./projects.entity";
import { ProjectRoles } from "./project-role.enum";


@Entity()
export class ProjectMemberEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=> UserEntity, (user)=>user.projectMemberships, {onDelete: 'CASCADE'})
    user:UserEntity;

    @ManyToOne(()=> ProjectEntity, (project)=>project.members, {onDelete: 'CASCADE'})
    project:ProjectEntity;

    @Column({type:'enum', enum: ProjectRoles})
    role:ProjectRoles

}