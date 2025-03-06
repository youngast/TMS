import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProjectDto{

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    members: number[];

    @IsNumber()
    userId: number;
}