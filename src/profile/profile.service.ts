import { Injectable } from '@nestjs/common';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(private profileRepository: ProfileRepository) { }

  async getUser(userId: string) {
    return this.profileRepository.findUser(userId)
  }
}
