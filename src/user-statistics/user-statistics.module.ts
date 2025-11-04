import { Module } from '@nestjs/common';
import { UserStatisticsService } from './user-statistics.service';
import { UserStatisticsController } from './user-statistics.controller';
import { UserStatisticsRepository } from './user-statistics.repository';
import { DbModule } from 'src/db/db.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DbModule, AuthModule],
  providers: [UserStatisticsService, UserStatisticsRepository],
  controllers: [UserStatisticsController],
})
export class UserStatisticsModule {}
