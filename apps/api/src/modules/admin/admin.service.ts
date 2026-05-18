import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getUsers(filters: { role?: string; kycStatus?: string }) {
    const where: any = {};
    if (filters.role) where.role = filters.role;
    if (filters.kycStatus) where.kycStatus = filters.kycStatus;

    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        role: true,
        fullNameAr: true,
        fullNameEn: true,
        phone: true,
        email: true,
        kycStatus: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async verifyKyc(userId: string, status: string, notes?: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { kycStatus: status as any },
    });
  }

  async getDashboardAnalytics() {
    const [totalUsers, totalProjects, activeProjects, totalRevenue] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.project.count(),
      this.prisma.project.count({ where: { status: 'IN_PROGRESS' } }),
      this.prisma.escrowTransaction.aggregate({
        where: { status: 'RELEASED' },
        _sum: { platformFee: true },
      }),
    ]);

    return {
      totalUsers,
      totalProjects,
      activeProjects,
      totalRevenue: totalRevenue._sum.platformFee || 0,
    };
  }
}
