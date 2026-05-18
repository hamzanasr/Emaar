import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SubmitMilestoneDto } from './dto/submit-milestone.dto';

@Injectable()
export class MilestonesService {
  constructor(private prisma: PrismaService) {}

  async submit(id: string, contractorId: string, dto: SubmitMilestoneDto) {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!milestone) throw new NotFoundException('المرحلة غير موجودة');
    if (milestone.project.contractorId !== contractorId) {
      throw new ForbiddenException('غير مصرح لك بتقديم هذه المرحلة');
    }
    if (milestone.status !== 'IN_PROGRESS' && milestone.status !== 'REJECTED') {
      throw new BadRequestException('لا يمكن تقديم هذه المرحلة في وضعها الحالي');
    }

    return this.prisma.milestone.update({
      where: { id },
      data: {
        status: 'SUBMITTED',
        submittedAt: new Date(),
        proofMedia: dto.proofMedia || [],
      },
    });
  }

  async approve(id: string, userId: string) {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!milestone) throw new NotFoundException('المرحلة غير موجودة');
    if (milestone.status !== 'SUBMITTED' && milestone.status !== 'UNDER_REVIEW') {
      throw new BadRequestException('لا يمكن الموافقة على هذه المرحلة في وضعها الحالي');
    }

    return this.prisma.milestone.update({
      where: { id },
      data: { status: 'APPROVED', approvedAt: new Date() },
    });
  }

  async reject(id: string, userId: string, reason: string) {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!milestone) throw new NotFoundException('المرحلة غير موجودة');
    if (milestone.status !== 'SUBMITTED' && milestone.status !== 'UNDER_REVIEW') {
      throw new BadRequestException('لا يمكن رفض هذه المرحلة في وضعها الحالي');
    }

    return this.prisma.milestone.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
  }
}
