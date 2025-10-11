import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) { }

  async registerUser(userData: { name: string; password: string }) {
    try {
      return await this.authRepository.createUser(userData.name, userData.password);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        'Ошибка при создании пользователя',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
