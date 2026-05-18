import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReferenceService } from './reference.service';

/**
 * Public reference data: regions, categories.
 * No auth required — used to power dropdowns/filters.
 */
@ApiTags('reference')
@Controller('reference')
export class ReferenceController {
  constructor(private readonly referenceService: ReferenceService) {}

  @Get('regions')
  @ApiOperation({ summary: 'List all active regions (public)' })
  async getRegions() {
    return this.referenceService.getRegions();
  }

  @Get('categories')
  @ApiOperation({ summary: 'List all active categories (public)' })
  async getCategories(@Query('parentId') parentId?: string) {
    return this.referenceService.getCategories(parentId);
  }
}
