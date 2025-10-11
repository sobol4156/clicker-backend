import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async createUser(username: string, password: string) {
    const user = await this.usersCollection.findOne({
      username
    });
    if (user) throw new HttpException('Пользователь уже существует', HttpStatus.BAD_REQUEST);

    await this.usersCollection.insertOne({
      username,
      password,
      createdAt: new Date(),
    });
    return { message: 'Пользователь успешно создан', statusCode: HttpStatus.CREATED };
  }

  async getAllUsers() {
    return this.usersCollection.find().toArray();
  }
}
