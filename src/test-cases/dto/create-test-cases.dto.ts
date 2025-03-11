import { IsString, IsOptional, IsNumber, IsArray } from "class-validator";

export class Step {
    id: string;
    step: string;
    expectedResult: string;
  }

export class CreateTestCaseDto {
    @IsString()
    title:string;

    @IsString()
    description:string;

    @IsArray()
    steps:Step[];

    @IsString()
    expectedResult: string;

    @IsString()
    status: string;
}