import { CreateTestCaseDto } from "./create-test-cases.dto";
import {PartialType } from '@nestjs/mapped-types';

export class UpdateTestCaseDto extends PartialType(CreateTestCaseDto) {}