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

    @Exclude()
    @Column()
    password:string;

    @Column({type:'enum', enum: UserRole, default: UserRole.USER})
    role:UserRole

    @OneToMany(()=> ProjectEntity, (project) => project.owner, {onDelete: 'CASCADE'})
    projects: ProjectEntity[];

    @ManyToMany(() => ProjectEntity, (project) => project.members)
    project: ProjectEntity[];

    @Column({nullable:true})
    avatarUrl: string | null;
}