import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ProjectEntity } from "src/projects/projects.entity";
import { UserRole } from "./user-role.enum";
import { ProjectMemberEntity } from "src/projects/project-member.entity";

@Entity(
    {
        name: 'users'
    }
)
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name:string;

    @Column({unique: true})
    email:string;

    @Column()
    password:string;

    @Column({type:'enum', enum: UserRole, default: UserRole.USER})
    role:UserRole

    @OneToMany(()=> ProjectEntity, (project) => project.owner, {onDelete: 'CASCADE'})
    projects: ProjectEntity[];

    @OneToMany(()=> ProjectMemberEntity, (member) => member.user, {onDelete: 'CASCADE'})
    projectMemberships: ProjectMemberEntity[];

}