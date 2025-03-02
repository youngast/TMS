import { IsNumber, IsNotEmpty, IsIn, IsString } from "class-validator";

export class CreateTestRunsDto {

    @IsNotEmpty()
    @IsString()
    title:string;

    @IsString()
    description:string;

    @IsNotEmpty()
    @IsNumber()
    testCaseId: number;

    @IsNotEmpty()
    @IsIn([1,2,3,4])
    status: number;

    @IsNotEmpty()
    @IsNumber()
    executionTime: number;

}