import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from "express";

export interface AuthRequest extends Request {
  user: {
    id: number;
    email: string;
    role?: string;
  };
}


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      throw new UnauthorizedException('Требуется авторизация');
    }

    console.log("📥 Декодированный JWT:", user);

    if (!user.id || isNaN(Number(user.id))) {
      throw new UnauthorizedException('Некорректный токен: ID пользователя отсутствует или невалиден');
    }

    const request = context.switchToHttp().getRequest<AuthRequest>();
    request.user = { ...user, id: Number(user.id) };

    return user;
  }
}