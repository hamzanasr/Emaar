import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { QualityService } from './quality.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@emaar/types';

@ApiTags('quality')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('quality')
export class QualityController {
  constructor(private readonly qualityService: QualityService) {}

  @Get('queue')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get quality review queue' })
  async getQueue() {
    return this.qualityService.getReviewQueue();
  }

  @Post(':milestoneId/review')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Submit quality review for a milestone' })
  async submitReview(
    @Param('milestoneId') milestoneId: string,
    @CurrentUser('id') inspectorId: string,
    @Body() body: any,
  ) {
    return this.qualityService.submitReview(milestoneId, inspectorId, body);
  }
}
