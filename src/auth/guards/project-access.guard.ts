import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from '@nestjs/core';
import { ProjectsService } from "src/projects/projects.service";

@Injectable()
export class ProjectAccessGuard implements CanActivate {
    constructor(private reflector: Reflector, private projectsService: ProjectsService) {}


async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const projectId = +request.params.projectId;

    if (!user || !projectId) {
      throw new ForbiddenException('Доступ запрещён');
    }

    const hasAccess = await this.projectsService.checkUserAccess(projectId, user.id);

    if(!hasAccess) {
        throw new ForbiddenException('Доступ запрещён');
    }

    return true;
    }
}