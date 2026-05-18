import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class QualityService {
  constructor(private prisma: PrismaService) {}

  async getReviewQueue() {
    return this.prisma.milestone.findMany({
      where: { status: 'SUBMITTED' },
      include: {
        project: {
          select: { id: true, titleAr: true, titleEn: true, totalBudget: true },
        },
      },
      orderBy: { submittedAt: 'asc' },
    });
  }

  async submitReview(milestoneId: string, inspectorId: string, data: any) {
    const milestone = await this.prisma.milestone.findUnique({ where: { id: milestoneId } });
    if (!milestone) throw new NotFoundException('المرحلة غير موجودة');

    // Calculate total score
    const scores = data.checklistScores || [];
    const totalWeight = scores.reduce((sum: number, s: any) => sum + (s.weight || 1), 0);
    const weightedScore = scores.reduce((sum: number, s: any) => sum + (s.weight || 1) * (s.score || 0), 0);
    const totalScore = totalWeight > 0 ? (weightedScore / totalWeight) * 100 : 0;

    // Determine verdict
    let verdict: 'PASS' | 'FAIL' | 'CONDITIONAL_PASS';
    if (totalScore >= 80) verdict = 'PASS';
    else if (totalScore >= 60) verdict = 'CONDITIONAL_PASS';
    else verdict = 'FAIL';

    // Create inspection record
    const inspection = await this.prisma.qualityInspection.create({
      data: {
        milestoneId,
        inspectorId,
        checklistScores: scores,
        totalScore,
        verdict,
        notes: data.notes,
        photos: data.photos || [],
        inspectedAt: new Date(),
      },
    });

    // Update milestone status based on verdict
    const newStatus = verdict === 'PASS' ? 'APPROVED' : verdict === 'CONDITIONAL_PASS' ? 'UNDER_REVIEW' : 'REJECTED';
    await this.prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        status: newStatus,
        ...(verdict === 'PASS' ? { approvedAt: new Date() } : {}),
      },
    });

    return inspection;
  }
}
