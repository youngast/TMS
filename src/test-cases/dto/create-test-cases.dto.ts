import { IsString, IsOptional, IsNumber } from "class-validator";

export class CreateTestCaseDto {
    @IsString()
    title:string;

    @IsString()
    @IsOptional()
    description:string;

    @IsString()
    @IsOptional()
    steps:string;

    @IsString()
    @IsOptional()
    expectedResult: string;

    @IsString()
    @IsOptional()
    status: string;
    
    @IsNumber()
    testSuiteId: number;  
}