import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { DbModule } from 'src/db/db.module';
import { AuthModule } from 'src/auth/auth.module';
import { ProfileRepository } from './profile.repository';

@Module({
  imports: [DbModule, AuthModule],
  providers: [ProfileService, ProfileRepository],
  controllers: [ProfileController]
})
export class ProfileModule { }
