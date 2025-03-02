import { IsEmail, IsString, IsNotEmpty} from "class-validator";

export class RegisterDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

}

export class LoginDto {

    @IsEmail()
    @IsNotEmpty()
    email:string;


    @IsString()
    @IsNotEmpty()
    password:string;

}