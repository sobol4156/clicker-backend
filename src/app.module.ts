import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { UserStatisticsModule } from './user-statistics/user-statistics.module';

@Module({
  imports: [DbModule, AuthModule, UserStatisticsModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
