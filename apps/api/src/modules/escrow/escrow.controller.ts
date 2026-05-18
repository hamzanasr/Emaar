import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { EscrowService } from './escrow.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@emaar/types';
import { DepositDto } from './dto/deposit.dto';

@ApiTags('escrow')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('escrow')
export class EscrowController {
  constructor(private readonly escrowService: EscrowService) {}

  @Post('deposit')
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Deposit funds into escrow for a milestone' })
  async deposit(@CurrentUser('id') userId: string, @Body() dto: DepositDto) {
    return this.escrowService.deposit(userId, dto);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get escrow status for a project' })
  async getProjectEscrow(@Param('projectId') projectId: string, @CurrentUser('id') userId: string) {
    return this.escrowService.getProjectEscrow(projectId, userId);
  }

  @Post(':id/release')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  @ApiOperation({ summary: 'Release escrow funds to contractor' })
  async release(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.escrowService.releaseFunds(id, userId);
  }
}
