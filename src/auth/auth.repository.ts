import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Collection } from 'mongodb';
import { DbService } from 'src/db/db.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly dbService: DbService, private readonly configService: ConfigService) { }

  private get usersCollection(): Collection {
    const dbName = this.configService.get<string>('DATABASE_NAME');
    if (!dbName) throw new Error('DATABASE_NAME not defined in .env');
    return this.dbService.getDb(dbName).collection('users');
  }

  async findByUsername(username: string) {
    return this.usersCollection.findOne({ username });
  }

  async createUser(user: any) {
    return this.usersCollection.insertOne(user);
  }

  async loginUser(username: string, password: string) {
    return this.usersCollection.findOne({
      username,
      password
    })
  }

  async getAllUsers() {
    return this.usersCollection.find().toArray();
  }
}
