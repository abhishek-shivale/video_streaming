import { Injectable } from '@nestjs/common';
import { prisma } from '@repo/database';
import { S3 } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { uploadVideoDto } from '@repo/types';
import { enqueueVideo } from '@repo/queue';

@Injectable()
export class VideoService {
  private client: S3;

  constructor() {
    this.client = new S3({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  private generateShareableLink(): string {
    return `${uuidv4().slice(0, 8)}-${Date.now().toString(36)}`;
  }

  async uploadVideo({ file, userId, name, description }: uploadVideoDto) {
    try {
      const videoId = uuidv4();
      const shareableLink = this.generateShareableLink();
      const sanitizedFilename = file.originalname
        .replace(/[^\w\d\-_.]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase();

      const fileKey = sanitizedFilename;

      const bucketName = process.env.AWS_BUCKET_NAME;

      await this.client.putObject({
        Bucket: bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      const video = await prisma.video.create({
        data: {
          id: videoId,
          name: name || file.originalname,
          description: description ?? name,
          rawVideoUrl: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
          shareableLink,
          status: 'UPLOADED',
          userId,
        },
      });

      await enqueueVideo({ key: video.id, message: video });

      return {
        id: video.id,
        shareableLink: video.shareableLink,
        status: video.status,
      };
    } catch (error) {
      console.error('Error uploading video:', error);
      throw new Error('Failed to upload video');
    }
  }

  async getVideos(userId: string) {
    try {
      const videos = await prisma.video.findMany({
        where: {
          userId,
        },
      });

      return videos;
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw new Error('Failed to fetch videos');
    }
  }
}
