import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class MarketplaceService {
  constructor(private prisma: PrismaService) {}

  async searchProducts(filters: { query?: string; categoryId?: string }) {
    const where: any = { isActive: true };
    if (filters.categoryId) where.categoryId = filters.categoryId;
    // TODO: Integrate Elasticsearch for full-text Arabic search

    return this.prisma.product.findMany({
      where,
      include: {
        store: { select: { id: true, storeNameAr: true, storeNameEn: true, rating: true } },
        category: { select: { id: true, nameAr: true, nameEn: true } },
      },
      take: 50,
    });
  }

  async getProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        store: { select: { id: true, storeNameAr: true, storeNameEn: true, rating: true, deliveryZones: true } },
        category: true,
      },
    });
    if (!product) throw new NotFoundException('المنتج غير موجود');
    return product;
  }

  async getStore(id: string) {
    const store = await this.prisma.supplierStore.findUnique({
      where: { id },
      include: {
        products: { where: { isActive: true }, take: 20 },
        category: true,
        user: { select: { id: true, fullNameAr: true, fullNameEn: true, avatarUrl: true } },
      },
    });
    if (!store) throw new NotFoundException('المتجر غير موجود');
    return store;
  }
}
