import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MilestonesService } from './milestones.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@emaar/types';
import { SubmitMilestoneDto } from './dto/submit-milestone.dto';

@ApiTags('milestones')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('milestones')
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Patch(':id/submit')
  @Roles(UserRole.CONTRACTOR)
  @ApiOperation({ summary: 'Submit milestone for review' })
  async submit(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: SubmitMilestoneDto,
  ) {
    return this.milestonesService.submit(id, userId, dto);
  }

  @Patch(':id/approve')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  @ApiOperation({ summary: 'Approve milestone' })
  async approve(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.milestonesService.approve(id, userId);
  }

  @Patch(':id/reject')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  @ApiOperation({ summary: 'Reject milestone' })
  async reject(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() body: { reason: string }) {
    return this.milestonesService.reject(id, userId, body.reason);
  }
}
