import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@CurrentUser() user: { userId: string; username: string }) {
    return this.profileService.getUser(user.userId)
  }
}
