import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MediaService } from './media.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('media')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('presigned-url')
  @ApiOperation({ summary: 'Get pre-signed URL for file upload' })
  async getPresignedUrl(@CurrentUser('id') userId: string, @Body() body: { fileName: string; mimeType: string; folder: string }) {
    return this.mediaService.getPresignedUrl(userId, body);
  }
}
