import { Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@UseGuards(AuthGuard('jwt'))
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) { }

  @Get('me')
  getMe(@CurrentUser() user: { userId: string; username: string }) {
    return this.profileService.getUser(user.userId)
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '../../uploads'),
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `file-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: { userId: string; username: string },
  ) {
    if (!file) {
      throw new Error('File not uploaded');
    }

    const filePath = `/uploads/${file.filename}`;

    const updatedUser = await this.profileService.updateUserProfileImage(
      user.userId,
      filePath,
    );

    return updatedUser;
  }
}
