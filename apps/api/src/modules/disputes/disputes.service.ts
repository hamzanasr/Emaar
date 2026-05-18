import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class DisputesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    return this.prisma.dispute.create({
      data: {
        projectId: data.projectId,
        milestoneId: data.milestoneId,
        raisedBy: userId,
        againstId: data.againstId,
        reason: data.reason,
        evidence: data.evidence || [],
      },
    });
  }

  async getUserDisputes(userId: string) {
    return this.prisma.dispute.findMany({
      where: { OR: [{ raisedBy: userId }, { againstId: userId }] },
      include: {
        project: { select: { id: true, titleAr: true, titleEn: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
