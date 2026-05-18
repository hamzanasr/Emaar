import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  s3Region: process.env.AWS_S3_REGION || 'me-south-1',
  s3Bucket: process.env.AWS_S3_BUCKET || 'emaar-media-dev',
  s3AccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  s3SecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  presignedUrlExpires: parseInt(process.env.PRESIGNED_URL_EXPIRES || '3600', 10),
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800', 10), // 50MB
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
}));
