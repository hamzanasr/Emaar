import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import { DepositDto } from './dto/deposit.dto';

@Injectable()
export class EscrowService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  /**
   * Client deposits funds for a milestone into escrow
   */
  async deposit(clientId: string, dto: DepositDto) {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id: dto.milestoneId },
      include: { project: true },
    });

    if (!milestone) throw new NotFoundException('المرحلة غير موجودة');
    if (milestone.project.clientId !== clientId) {
      throw new ForbiddenException('غير مصرح لك بالإيداع لهذا المشروع');
    }

    // Check if escrow already exists for this milestone
    const existing = await this.prisma.escrowTransaction.findUnique({
      where: { milestoneId: dto.milestoneId },
    });
    if (existing) {
      throw new BadRequestException('تم إيداع مبلغ مسبقاً لهذه المرحلة');
    }

    // Calculate platform fee
    const feePercent = this.config.get<number>('app.contractorFeePercent')!;
    const platformFee = milestone.amount.toNumber() * (feePercent / 100);

    // Create escrow transaction
    const escrow = await this.prisma.escrowTransaction.create({
      data: {
        milestoneId: milestone.id,
        projectId: milestone.projectId,
        payerId: clientId,
        payeeId: milestone.project.contractorId!,
        totalAmount: milestone.amount,
        heldAmount: milestone.amount,
        releasedAmount: 0,
        platformFee,
        status: 'CREATED',
      },
    });

    // TODO: Integrate with payment gateway (HyperPay/Tap)
    // After successful payment callback, update status to FUNDED -> HELD

    return escrow;
  }

  /**
   * Get all escrow transactions for a project
   */
  async getProjectEscrow(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('المشروع غير موجود');

    return this.prisma.escrowTransaction.findMany({
      where: { projectId },
      include: {
        milestone: { select: { id: true, titleAr: true, titleEn: true, sequenceOrder: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Release funds from escrow to contractor after approval
   */
  async releaseFunds(escrowId: string, userId: string) {
    const escrow = await this.prisma.escrowTransaction.findUnique({
      where: { id: escrowId },
      include: { milestone: { include: { project: true } } },
    });

    if (!escrow) throw new NotFoundException('معاملة الضمان غير موجودة');
    if (escrow.status !== 'HELD') {
      throw new BadRequestException('لا يمكن الإفراج عن هذه المعاملة في وضعها الحالي');
    }

    // Only project client or admin can release
    const isClient = escrow.milestone.project.clientId === userId;
    if (!isClient) {
      // Check if admin (handled by RolesGuard, but double-check)
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
        throw new ForbiddenException('غير مصرح لك بهذا الإجراء');
      }
    }

    // Release funds in a transaction
    return this.prisma.$transaction(async (tx) => {
      // Update escrow
      const released = await tx.escrowTransaction.update({
        where: { id: escrowId },
        data: {
          status: 'RELEASED',
          releasedAmount: escrow.totalAmount,
          heldAmount: 0,
          releasedAt: new Date(),
        },
      });

      // Update milestone to PAID
      await tx.milestone.update({
        where: { id: escrow.milestoneId },
        data: { status: 'PAID' },
      });

      // TODO: Trigger actual payment transfer to contractor's account

      return released;
    });
  }
}
