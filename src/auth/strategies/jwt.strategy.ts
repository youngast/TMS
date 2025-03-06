import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends require('@nestjs/passport').PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 📌 Берём токен из заголовка
      secretOrKey: process.env.JWT_SECRET || 'secretKey', // 📌 Используем секретный ключ
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user; // 📌 Данные о пользователе попадут в `req.user`
  }
}
