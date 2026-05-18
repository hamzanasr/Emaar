import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { CreateBidDto } from './dto/create-bid.dto';
import { UserRole } from '@emaar/types';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(clientId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        clientId,
        regionId: dto.regionId,
        titleAr: dto.titleAr,
        titleEn: dto.titleEn,
        description: dto.description,
        categoryId: dto.categoryId,
        totalBudget: dto.totalBudget,
        currency: dto.currency || 'SAR',
        status: 'DRAFT',
        address: dto.address || {},
        specs: dto.specs || {},
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        expectedEnd: dto.expectedEnd ? new Date(dto.expectedEnd) : null,
      },
    });
  }

  async findAll(user: any, filters: { status?: string; page: number; limit: number }) {
    const { status, page, limit } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Role-based filtering
    switch (user.role) {
      case UserRole.CLIENT:
        where.clientId = user.id;
        break;
      case UserRole.CONTRACTOR:
        where.OR = [
          { contractorId: user.id },
          { status: 'PUBLISHED' },
          { status: 'BIDDING' },
        ];
        break;
      case UserRole.ADMIN:
      case UserRole.SUPER_ADMIN:
        // Admin sees all
        break;
      default:
        where.clientId = user.id;
    }

    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: { select: { id: true, fullNameAr: true, fullNameEn: true, avatarUrl: true } },
          contractor: { select: { id: true, fullNameAr: true, fullNameEn: true, avatarUrl: true } },
          category: { select: { id: true, nameAr: true, nameEn: true } },
          region: { select: { id: true, nameAr: true, nameEn: true } },
          _count: { select: { milestones: true, bids: true } },
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, fullNameAr: true, fullNameEn: true, phone: true, avatarUrl: true } },
        contractor: {
          select: {
            id: true,
            fullNameAr: true,
            fullNameEn: true,
            avatarUrl: true,
            contractorProfile: true,
          },
        },
        milestones: { orderBy: { sequenceOrder: 'asc' } },
        category: true,
        region: true,
      },
    });

    if (!project) {
      throw new NotFoundException('المشروع غير موجود');
    }

    return project;
  }

  async createBid(projectId: string, contractorId: string, dto: CreateBidDto) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });

    if (!project) {
      throw new NotFoundException('المشروع غير موجود');
    }

    if (project.status !== 'PUBLISHED' && project.status !== 'BIDDING') {
      throw new BadRequestException('لا يمكن تقديم عرض على هذا المشروع في وضعه الحالي');
    }

    // Update project status to BIDDING if first bid
    if (project.status === 'PUBLISHED') {
      await this.prisma.project.update({
        where: { id: projectId },
        data: { status: 'BIDDING' },
      });
    }

    return this.prisma.bid.create({
      data: {
        projectId,
        contractorId,
        amount: dto.amount,
        duration: dto.duration,
        proposal: dto.proposal,
      },
    });
  }

  async getBids(projectId: string) {
    return this.prisma.bid.findMany({
      where: { projectId },
      include: {
        contractor: {
          select: {
            id: true,
            fullNameAr: true,
            fullNameEn: true,
            avatarUrl: true,
            contractorProfile: { select: { qualityRating: true, totalProjects: true, specializations: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async acceptBid(projectId: string, bidId: string, clientId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });

    if (!project || project.clientId !== clientId) {
      throw new ForbiddenException('غير مصرح لك بهذا الإجراء');
    }

    const bid = await this.prisma.bid.findUnique({ where: { id: bidId } });
    if (!bid || bid.projectId !== projectId) {
      throw new NotFoundException('العرض غير موجود');
    }

    // Accept bid and reject others in a transaction
    return this.prisma.$transaction(async (tx) => {
      await tx.bid.update({ where: { id: bidId }, data: { status: 'ACCEPTED' } });
      await tx.bid.updateMany({
        where: { projectId, id: { not: bidId } },
        data: { status: 'REJECTED' },
      });
      return tx.project.update({
        where: { id: projectId },
        data: { contractorId: bid.contractorId, status: 'IN_PROGRESS' },
      });
    });
  }
}
