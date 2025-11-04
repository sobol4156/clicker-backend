import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Collection, ObjectId } from 'mongodb';
import { DbService } from 'src/db/db.service';

@Injectable()
export class ProfileRepository {
  constructor(private readonly dbService: DbService, private readonly configService: ConfigService) { }

  private get usersCollection(): Collection {
    const dbName = this.configService.get<string>('DATABASE_NAME');
    if (!dbName) throw new Error('DATABASE_NAME not defined in .env');
    return this.dbService.getDb(dbName).collection('users');
  }

  async findUser(userId: string) {
    try {
      return this.usersCollection.findOne({ _id: new ObjectId(userId) }, {projection: {_id: 0}});
    } catch (error) {
      return null;
    }
  }
}
