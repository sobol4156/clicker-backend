import { Injectable } from '@nestjs/common';
import { ProfileRepository } from './profile.repository';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class ProfileService {
  constructor(private profileRepository: ProfileRepository) { }

  async getUser(userId: string) {
    return this.profileRepository.findUser(userId)
  }

  async updateUserProfileImage(userId: string, filePath: string) {
    const oldUser = await this.profileRepository.findUser(userId);

    if (!oldUser) {
      return {
        success: false,
        message: 'User not found',
        user: null,
      };
    }

    if (oldUser?.avatarUrl) {
      try {
        const oldFilePath = join(__dirname, '../../uploads', oldUser.avatarUrl.split('/').pop());

        await fs.unlink(oldFilePath);
        console.log('Old file deleted:', oldFilePath);
      } catch (err) {
        console.warn('Old file not found or cannot be deleted:', err.message);
      }
    }

    await this.profileRepository.updateUser(userId, filePath);

    return {
      success: true,
      message: 'User avatar updated successfully',
    };
  }
}
