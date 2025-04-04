import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { VideoService } from './video.service';
import type { CreateVideoDto } from '@repo/types';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response, Request as ExpressRequest } from 'express';
import { decodeAccessToken } from '@repo/utils/tokens';
// import { JwtGuard } from '../jwt/jwt.guard';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  // @UseInterceptors(JwtGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1024 * 1024 * 1000,
        files: 1,
      },
    }),
  )
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() createVideoDto: CreateVideoDto,
    @Res() res: Response,
  ) {
    try {
      const video = await this.videoService.uploadVideo({
        file,
        userId: createVideoDto.userId,
        name: createVideoDto.name,
        description: createVideoDto.description,
      });
      if (!video) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Video Not Found!',
        });
      }

      return res.status(200).json({
        success: true,
        data: video,
        message: 'Video Uploaded Successfully!',
      });
    } catch (e) {
      return res.status(400).json({
        success: false,
        data: e,
        message: 'Video Not Found!',
      });
    }
  }

  @Get('/get-videos')
  async getVideos(@Res() res: Response, @Req() req: ExpressRequest) {
    try {
      console.log('accessToken');
      const accessToken = req.headers['cookie']
        .split(';')
        .filter((x) => x.includes('accessToken'))[0]
        .split('=')[1];
      const refreshToken = req.headers['cookie']
        .split(';')
        .filter((x) => x.includes('refreshToken'))[0]
        .split('=')[1];
      if (!accessToken || !refreshToken) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Invalid Credentials!',
        });
      }
      const data = decodeAccessToken(accessToken);
      if (!data) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Invalid Credentials!',
        });
      }

      if (typeof data !== 'object' || !data.hasOwnProperty('id')) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Invalid Credentials!',
        });
      }

      const id = data.id;
      const videos = await this.videoService.getVideos(id);
      return res.status(200).json({
        success: true,
        data: videos,
        message: 'Videos Fetched Successfully!',
      });
    } catch (e) {
      return res.status(400).json({
        success: false,
        data: e,
        message: 'Videos Not Found!',
      });
    }
  }
}
