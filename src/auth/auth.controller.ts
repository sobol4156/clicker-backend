import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() userData: { username: string; password: string }) {
    const { username, password } = userData;
    
    return this.authService.register(username, password);
  }

  @Post('login')
  login(@Body() userData: { username: string; password: string }) {
    const { username, password } = userData;

    return this.authService.login(username, password);
  }
}
