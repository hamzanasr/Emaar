import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@emaar/types';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'List all users (admin)' })
  async getUsers(@Query('role') role?: string, @Query('kycStatus') kycStatus?: string) {
    return this.adminService.getUsers({ role, kycStatus });
  }

  @Patch('users/:id/verify')
  @ApiOperation({ summary: 'Verify user KYC' })
  async verifyUser(@Param('id') id: string, @Body() body: { status: string; notes?: string }) {
    return this.adminService.verifyKyc(id, body.status, body.notes);
  }

  @Get('analytics/dashboard')
  @ApiOperation({ summary: 'Get dashboard analytics' })
  async getDashboard() {
    return this.adminService.getDashboardAnalytics();
  }
}
