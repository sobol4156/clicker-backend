import { Injectable } from '@nestjs/common';
import { UserStatisticsRepository } from './user-statistics.repository';

@Injectable()
export class UserStatisticsService {
  constructor(private userStatisticsRepo: UserStatisticsRepository) { }

  async syncUserScore(userId: string, username: string, score: number) {
    const safeScore = Number.isFinite(score) && score >= 0 ? Math.floor(score) : 0;
    return this.userStatisticsRepo.upsertScoreByUserId(userId, username, safeScore);
  }

  async getTopUsers(count: number){
    const users = await this.userStatisticsRepo.findTop(count);
    return users.map((u: any) => ({ userId: u.userId, username: u.username, score: u.score ?? 0 }));
  }
}
