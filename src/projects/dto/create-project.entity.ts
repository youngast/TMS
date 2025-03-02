import { IsNotEmpty, IsString } from "class-validator";

export class CreateProjectDto{

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    description: string;
}