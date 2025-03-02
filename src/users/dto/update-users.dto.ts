import { IsString, IsOptional, IsEmail } from "class-validator";

export class UpdateUser {

    @IsString()
    @IsOptional()
    name: string;

    @IsEmail()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    password: string;

}