import { IsNumber, IsNotEmpty, IsIn, IsOptional, IsString } from "class-validator";

export class UpdateTestRunsDto {

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    title:string;

    @IsString()
    @IsOptional()
    description:string;

    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    testCaseId: number;

    @IsNotEmpty()
    @IsIn([1,2,3,4])
    @IsOptional()
    status: number;

    @IsNotEmpty()
    @IsNumber()
    executionTime: number;

}