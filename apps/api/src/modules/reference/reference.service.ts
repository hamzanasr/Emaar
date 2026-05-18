import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ReferenceService {
  constructor(private prisma: PrismaService) {}

  async getRegions() {
    return this.prisma.region.findMany({
      where: { isActive: true },
      orderBy: { nameAr: 'asc' },
      select: {
        id: true,
        nameAr: true,
        nameEn: true,
        countryCode: true,
        city: true,
      },
    });
  }

  async getCategories(parentId?: string) {
    return this.prisma.category.findMany({
      where: {
        isActive: true,
        ...(parentId !== undefined ? { parentId: parentId || null } : {}),
      },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        nameAr: true,
        nameEn: true,
        parentId: true,
        icon: true,
        sortOrder: true,
      },
    });
  }
}
