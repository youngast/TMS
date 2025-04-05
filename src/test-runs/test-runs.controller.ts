import { Controller, Get, Post, Body, Delete, Param, Patch, NotFoundException, Header, Res } from '@nestjs/common';
import { TestRunsService } from './test-runs.service';
import { CreateTestRunsDto } from './dto/create-test-runs.dto';
import { UpdateTestRunsDto } from './dto/update-test-runs.dto';
import { Response } from 'express';

@Controller('projects/:projectId/test-runs')
export class TestRunsController {
    constructor(private testRunsService: TestRunsService) {}

    @Get()
    async getAllTestRuns(@Param('projectId') projectId: string) {
        const testRuns = await this.testRunsService.getAllTestRuns(+projectId);
        console.log("Test runs from DB:", testRuns); 
        return testRuns;
    }    

    @Get(':id')
    async getTestRunById(@Param('id') testRunId: string) {
        const testRun = await this.testRunsService.getTestRunById(+testRunId);
        if (!testRun) {
            throw new NotFoundException(`Тест-ран с ID=${testRunId} не найден`);
        }
        return testRun;
    }

    @Post('empty')
    createEmptyTestRun(@Body() body: { title: string, description: string }) {
        return this.testRunsService.createEmptyTestRun(body.title, body.description);
    }

    @Post(':testRunId/add-test-case/:testCaseId')
    addTestCaseToRun(@Param('testRunId') testRunId: string, @Param('testCaseId') testCaseId: string) {
        return this.testRunsService.addTestCaseToRun(+testRunId, +testCaseId);
    }

    @Post()
    async createTestRun(@Param('projectId') projectId: string, @Body() body: CreateTestRunsDto) {
        return this.testRunsService.createTestRunWithCases(body, +projectId);
    }

    @Patch(':id')
    updateTestRun(@Param('id') id: string, @Body() body: UpdateTestRunsDto) {
        return this.testRunsService.updateTestRuns(+id, body);
    }

    @Delete(':id')
    deleteTestRun(@Param('id') id: string) {
        return this.testRunsService.deleteTestRuns(+id);
    }

    @Patch('/test-cases/:testCaseId/status')
    async updateTestCaseStatus(
        @Param('projectId') projectId: string,
        @Param('testCaseId') testCaseId: string,
        @Body() body: { status: string }
    ) {
        console.log(`Updating test case ${testCaseId} in project ${projectId} with status ${body.status}`);
        return this.testRunsService.updateTestCaseStatus(+testCaseId, body.status);
    }     

    @Patch(':id/complete')
    async completeTestRun(@Param('id') testRunId: string) {
        return this.testRunsService.completeTestRun(+testRunId);
    }

    @Get(':id/export-to-pdf')
    async exportPdf(@Param('id') id: number, @Res() res: Response) {
        const pdf = await this.testRunsService.exportTestRunToPdf(id);
    
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="test-run.pdf"',
            'Content-Length': pdf.length,
        });
    
        res.send(pdf);
    }
}