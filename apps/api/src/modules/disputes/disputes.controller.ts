import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DisputesService } from './disputes.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('disputes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('disputes')
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Post()
  @ApiOperation({ summary: 'Raise a dispute' })
  async create(@CurrentUser('id') userId: string, @Body() body: any) {
    return this.disputesService.create(userId, body);
  }

  @Get()
  @ApiOperation({ summary: 'Get user disputes' })
  async getAll(@CurrentUser('id') userId: string) {
    return this.disputesService.getUserDisputes(userId);
  }
}
