import { UserStatisticsService } from './user-statistics.service';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('user-statistics')
export class UserStatisticsController {
  constructor(private userStatisticsService: UserStatisticsService) { }

  @Get('top')
  getTopUsers(@Query('limit') limit?: string) {
    const count = Number(limit) || 10
    return this.userStatisticsService.getTopUsers(count);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMyScore(@CurrentUser() user: { userId: string; username: string }) {
    return this.userStatisticsService.getMyScore(user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update')
  syncUserScore(
    @CurrentUser() user: { userId: string; username: string },
    @Body() body: { score: number },
  ) {
    return this.userStatisticsService.syncUserScore(user.userId, user.username, body?.score);
  }
}
