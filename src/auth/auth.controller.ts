import { Controller, Post, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post()
  register(@Body() userData: { name: string; password: string }) {
    return this.authService.registerUser(userData);
  }
}
