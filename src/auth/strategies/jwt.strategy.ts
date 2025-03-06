import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'SECRET_KEY',
    });
  }

  async validate(payload: { id: number; email: string }) {
    console.log("JWT", payload);
    const user = await this.userService.findById(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    console.log('user', user);
    return user;
  }
}
