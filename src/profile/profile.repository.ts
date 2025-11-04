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
      return this.usersCollection.findOne({ _id: new ObjectId(userId) }, { projection: { _id: 0 } });
    } catch (error) {
      return null;
    }
  }

  async updateUser(userId: string, filePath: string) {
    try {
      const result = await this.usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { avatarUrl: filePath } }
      );

      // Проверяем, найден ли пользователь
      if (result.matchedCount === 0) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      // Проверяем, было ли изменение
      if (result.modifiedCount === 0) {
        return {
          success: true,
          message: 'Avatar was already set to this value',
        };
      }

      return {
        success: true,
        message: 'User avatar updated successfully',
      };
    } catch (error) {
      console.error('Error updating user avatar:', error);
      return {
        success: false,
        message: 'Failed to update user avatar',
      };
    }
  }
}
