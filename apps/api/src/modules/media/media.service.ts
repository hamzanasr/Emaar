import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MediaService {
  constructor(private config: ConfigService) {}

  async getPresignedUrl(userId: string, data: { fileName: string; mimeType: string; folder: string }) {
    const allowedMimeTypes = this.config.get<string[]>('storage.allowedMimeTypes')!;
    if (!allowedMimeTypes.includes(data.mimeType)) {
      throw new BadRequestException('نوع الملف غير مدعوم');
    }

    const bucket = this.config.get<string>('storage.s3Bucket');
    const ext = data.fileName.split('.').pop();
    const key = `${data.folder}/${uuidv4()}.${ext}`;

    // TODO: Generate actual AWS S3 pre-signed URL
    // const s3 = new S3Client({ region: config.get('storage.s3Region') });
    // const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: data.mimeType });
    // const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return {
      uploadUrl: `https://${bucket}.s3.amazonaws.com/${key}`,
      key,
      expiresIn: 3600,
    };
  }
}
