import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Collection } from 'mongodb';
import { DbService } from 'src/db/db.service';

@Injectable()
export class UserStatisticsRepository {
  constructor(private readonly configService: ConfigService, private readonly dbService: DbService) { }

  private get usersStatisticsCollection(): Collection {
    const dbName = this.configService.get<string>('DATABASE_NAME');
    if (!dbName) throw new Error('DATABASE_NAME not defined in .env');
    return this.dbService.getDb(dbName).collection('user_statistics');
  }

  findByUserId(userId: string) {
    return this.usersStatisticsCollection.findOne({ userId });
  }

  async upsertScoreByUserId(userId: string, username: string, score: number) {
    const now = new Date();
    await this.usersStatisticsCollection.updateOne(
      { userId },
      {
        $set: {
          userId,
          username,
          score,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true },
    );
    return { score };
  }

  async findTop(limit: number) {
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(Math.floor(limit), 100) : 10;
    return this.usersStatisticsCollection
      .find({}, { projection: { _id: 0, username: 1, score: 1, updatedAt: 1 } })
      .sort({ score: -1, updatedAt: -1 })
      .limit(safeLimit)
      .toArray();
  }
}
