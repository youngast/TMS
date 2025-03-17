import { Controller, Get, Post, Body, Delete, Param, Patch, NotFoundException } from '@nestjs/common';
import { TestRunsService } from './test-runs.service';
import { CreateTestRunsDto } from './dto/create-test-runs.dto';
import { UpdateTestRunsDto } from './dto/update-test-runs.dto';

@Controller('projects/:projectId/test-runs')
export class TestRunsController {
    constructor(private testRunsService: TestRunsService) {}

    // Получить все тест-раны в проекте
    @Get()
    getAllTestRuns(@Param('projectId') projectId: string) {
        return this.testRunsService.getAllTestRuns(+projectId);
    }

    // Получить тест-раны по тест-кейсу
    @Get('test-case/:testCaseId')
    async getTestRunsByCase(@Param('testCaseId') testCaseId: string) {
        const testRuns = await this.testRunsService.getTestRunsByCaseId(+testCaseId);
        if (!testRuns || testRuns.length === 0) {
            throw new NotFoundException(`Тест-раны для testCaseId=${testCaseId} не найдены`);
        }
        return testRuns;
    }

    // Создать пустой тест-ран
    @Post('empty')
    createEmptyTestRun(@Body() body: { title: string, description: string }) {
        return this.testRunsService.createEmptyTestRun(body.title, body.description);
    }

    // Добавить тест-кейс в существующий тест-ран
    @Post(':testRunId/add-test-case/:testCaseId')
    addTestCaseToRun(@Param('testRunId') testRunId: string, @Param('testCaseId') testCaseId: string) {
        return this.testRunsService.addTestCaseToRun(+testRunId, +testCaseId);
    }

    // Создать тест-ран с тест-сьютом или выбранными тест-кейсами
    @Post()
    createTestRunWithCases(@Param('projectId') projectId: string, @Body() body: CreateTestRunsDto) {
        return this.testRunsService.createTestRunWithCases(body, +projectId);
    }

    // Обновить тест-ран (например, изменить статус или добавить тест-кейсы)
    @Patch(':id')
    updateTestRun(@Param('id') id: string, @Body() body: UpdateTestRunsDto) {
        return this.testRunsService.updateTestRuns(+id, body);
    }

    // Удалить тест-ран
    @Delete(':id')
    deleteTestRun(@Param('id') id: string) {
        return this.testRunsService.deleteTestRuns(+id);
    }
}