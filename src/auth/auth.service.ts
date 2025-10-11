import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository, private jwtService: JwtService) { }

  async register(username: string, password: string) {
    const existing = await this.authRepository.findByUsername(username);
    if (existing) {
      throw new HttpException('Пользователь уже существует', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await this.authRepository.createUser({
      username,
      password: hashedPassword,
      createdAt: new Date(),
    });

    const payload = { sub: result.insertedId.toString(), username };

    const access_token = this.jwtService.sign(payload);

    return { message: 'Пользователь успешно создан', access_token: access_token };
  }

  async login(username: string, password: string) {
    const user = await this.authRepository.findByUsername(username);
    if (!user) {
      throw new HttpException('Неверный логин или пароль', HttpStatus.UNAUTHORIZED);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new HttpException('Неверный логин или пароль', HttpStatus.UNAUTHORIZED);
    }
    const payload = { sub: user.userId, username: user.username };

    const access_token = this.jwtService.sign(payload);

    return { message: 'Успешный вход', access_token };
  }
}
