import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MarketplaceService } from './marketplace.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('marketplace')
@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get('products')
  @ApiOperation({ summary: 'List/search products' })
  async listProducts(@Query('q') query?: string, @Query('categoryId') categoryId?: string) {
    return this.marketplaceService.searchProducts({ query, categoryId });
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Get product details' })
  async getProduct(@Param('id') id: string) {
    return this.marketplaceService.getProduct(id);
  }

  @Get('stores/:id')
  @ApiOperation({ summary: 'Get store details' })
  async getStore(@Param('id') id: string) {
    return this.marketplaceService.getStore(id);
  }
}
