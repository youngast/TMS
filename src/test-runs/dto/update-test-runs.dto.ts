import { IsOptional, IsString, IsNumber, IsArray, IsEnum, ValidateIf } from 'class-validator';
import { TestRunStatus } from '../test-runs.entity';

export class UpdateTestRunsDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsOptional()
    @IsNumber()
    executionTime?: number;

    @IsOptional()
    @IsEnum(TestRunStatus)
    status?: TestRunStatus;

    @IsOptional()
    @IsNumber()
    @ValidateIf((o) => !o.testCaseIds || o.testCaseIds.length === 0)
    testSuiteId?: number;

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @ValidateIf((o) => !o.testSuiteId)
    testCaseIds?: number[];
}