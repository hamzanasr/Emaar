import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProjectsService } from './projects.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@emaar/types';
import { CreateProjectDto } from './dto/create-project.dto';
import { CreateBidDto } from './dto/create-bid.dto';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Create a new project' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List projects (filtered by role)' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @CurrentUser() user: any,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.projectsService.findAll(user, { status, page: page || 1, limit: limit || 20 });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project details' })
  async findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.projectsService.findOne(id, userId);
  }

  @Post(':id/bids')
  @Roles(UserRole.CONTRACTOR)
  @ApiOperation({ summary: 'Submit a bid for a project' })
  async createBid(
    @Param('id') projectId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateBidDto,
  ) {
    return this.projectsService.createBid(projectId, userId, dto);
  }

  @Get(':id/bids')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  @ApiOperation({ summary: 'List bids for a project' })
  async getBids(@Param('id') projectId: string) {
    return this.projectsService.getBids(projectId);
  }

  @Post(':id/bids/:bidId/accept')
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Accept a bid' })
  async acceptBid(
    @Param('id') projectId: string,
    @Param('bidId') bidId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.projectsService.acceptBid(projectId, bidId, userId);
  }
}
