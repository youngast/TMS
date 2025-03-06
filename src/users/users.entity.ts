import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany } from "typeorm";
import { ProjectEntity } from "src/projects/projects.entity";
import { UserRole } from "./user-role.enum";
import { Exclude } from "class-transformer";

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
    @Exclude()
    password:string;

    @Column({type:'enum', enum: UserRole, default: UserRole.USER})
    @Exclude()
    role:UserRole

    @OneToMany(()=> ProjectEntity, (project) => project.owner, {onDelete: 'CASCADE'})
    projects: ProjectEntity[];

    @ManyToMany(() => ProjectEntity, (project) => project.members)
    project: ProjectEntity[];
}