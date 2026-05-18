'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import {
  Button,
  Card,
  CardTitle,
  Badge,
  Divider,
  ProgressBar,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  EmptyState,
  cn,
} from '@emaar/ui';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import {
  useProject,
  useProjectBids,
  useProjectEscrow,
  useCategories,
  useRegions,
  useAcceptBid,
  useApproveMilestone,
  useDepositEscrow,
} from '@/hooks/api';
import { formatCurrency, formatDate, projectStatusConfig, milestoneStatusConfig, escrowStatusConfig } from '@/lib/formatters';
import type { Milestone, EscrowTransaction, Bid } from '@emaar/types';

// ═══════════════════════════════════════════════════════════════
// Project Detail Content
// ═══════════════════════════════════════════════════════════════

function ProjectDetailContent({ projectId }: { projectId: string }) {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  // ─── Data fetching ────────────────────────────────────────────
  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: bids = [] } = useProjectBids(projectId);
  const { data: escrowTxns = [] } = useProjectEscrow(projectId);
  const { data: categories = [] } = useCategories();
  const { data: regions = [] } = useRegions();

  if (projectLoading) {
    return (
      <DashboardLayout role="CLIENT" title="جارٍ التحميل...">
        <div className="text-center py-20 text-white/50">جارٍ تحميل تفاصيل المشروع</div>
      </DashboardLayout>
    );
  }
  if (!project) notFound();

  const status = projectStatusConfig[project.status];
  const category = categories.find((c) => c.id === project.categoryId);
  const region = regions.find((r) => r.id === project.regionId);

  // Milestones come bundled with project detail (Project type with milestones relation)
  type ProjectWithMilestones = typeof project & {
    milestones?: { id: string; status: string; amount: number | string; titleAr: string; titleEn: string; description?: string; sequenceOrder: number; dueDate?: string; submittedAt?: string; approvedAt?: string; proofMedia: unknown[]; checklist: unknown[]; createdAt: string; projectId: string }[];
  };
  const milestones = (project as ProjectWithMilestones).milestones ?? [];

  const completedMilestones = milestones.filter(
    (m) => m.status === 'PAID' || m.status === 'APPROVED',
  ).length;
  const progress =
    milestones.length > 0 ? (completedMilestones / milestones.length) * 100 : 0;

  const totalReleased = escrowTxns.reduce((sum, t) => sum + Number(t.releasedAmount), 0);
  const totalHeld = escrowTxns.reduce((sum, t) => sum + Number(t.heldAmount), 0);

  const [activeTab, setActiveTab] = React.useState('overview');

  return (
    <DashboardLayout
      role="CLIENT"
      title={project.titleAr}
      subtitle={`#${project.id.slice(-6)} · ${category?.nameAr || ''}`}
      actions={
        project.status === 'BIDDING' || project.status === 'PUBLISHED' ? (
          <Button variant="outline-gold" size="sm">
            تعديل المشروع
          </Button>
        ) : undefined
      }
    >
      <div className="space-y-6">
        {/* Back link */}
        <Link
          href={`/${locale}/client/projects`}
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-gold-300 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h15" />
          </svg>
          عودة للمشاريع
        </Link>

        {/* ─── Hero Card ─── */}
        <Card variant="luxury" rim>
          <div className="flex flex-col lg:flex-row items-start gap-6">
            {/* Category icon */}
            <div className="w-20 h-20 rounded-card-lg bg-gold-500/10 flex items-center justify-center text-5xl shrink-0">
              {category?.icon || '🏗️'}
            </div>

            {/* Main info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-3xl font-black text-white tracking-tight">
                  {project.titleAr}
                </h1>
                <Badge variant={status.variant} dot>
                  {status.label}
                </Badge>
              </div>
              <p className="text-white/60 leading-relaxed mb-5">{project.description}</p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-2 text-white/70">
                  <svg className="w-4 h-4 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {region?.nameAr || '—'}
                  {project.address?.formattedAddress && (
                    <span className="text-white/40">· {project.address.formattedAddress}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-white/70">
                  <svg className="w-4 h-4 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  أُنشئ في {formatDate(project.createdAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Progress (if active) */}
          {project.status === 'IN_PROGRESS' && milestones.length > 0 && (
            <>
              <Divider variant="gold" className="my-6" />
              <ProgressBar value={progress} variant="gold" showLabel />
            </>
          )}
        </Card>

        {/* ─── Quick Stats ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card variant="default" className="!p-5">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">الميزانية</p>
            <p className="text-xl font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
              {formatCurrency(Number(project.totalBudget))}
            </p>
          </Card>
          <Card variant="default" className="!p-5">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">المراحل</p>
            <p className="text-xl font-bold text-white">
              {completedMilestones} <span className="text-white/40">/</span> {milestones.length}
            </p>
          </Card>
          <Card variant="default" className="!p-5">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">مدفوع</p>
            <p className="text-xl font-bold text-success">{formatCurrency(totalReleased)}</p>
          </Card>
          <Card variant="default" className="!p-5">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">في الضمان</p>
            <p className="text-xl font-bold text-gold-300">{formatCurrency(totalHeld)}</p>
          </Card>
        </div>

        {/* ─── Tabs ─── */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger
              value="milestones"
              badge={
                milestones.length > 0 ? (
                  <Badge variant={activeTab === 'milestones' ? 'neutral' : 'gold'} className="!py-0.5">
                    {milestones.length}
                  </Badge>
                ) : null
              }
            >
              المراحل
            </TabsTrigger>
            <TabsTrigger
              value="bids"
              badge={
                bids.length > 0 ? (
                  <Badge variant={activeTab === 'bids' ? 'neutral' : 'gold'} className="!py-0.5">
                    {bids.length}
                  </Badge>
                ) : null
              }
            >
              العروض
            </TabsTrigger>
            <TabsTrigger value="escrow">الضمان المالي</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card variant="default" className="lg:col-span-2">
                <CardTitle className="mb-4">معلومات المشروع</CardTitle>
                <div className="space-y-1">
                  <DetailRow label="فئة المشروع" value={category?.nameAr || '—'} />
                  <DetailRow label="المنطقة" value={region?.nameAr || '—'} />
                  <DetailRow
                    label="العنوان التفصيلي"
                    value={project.address?.formattedAddress || '—'}
                  />
                  <DetailRow
                    label="تاريخ البدء المتوقع"
                    value={project.startDate ? formatDate(project.startDate) : '—'}
                  />
                  <DetailRow
                    label="تاريخ الانتهاء المتوقع"
                    value={project.expectedEnd ? formatDate(project.expectedEnd) : '—'}
                  />
                  {project.actualEnd && (
                    <DetailRow
                      label="تاريخ الانتهاء الفعلي"
                      value={formatDate(project.actualEnd)}
                    />
                  )}
                  <DetailRow
                    label="الحالة"
                    value={
                      <Badge variant={status.variant} dot>
                        {status.label}
                      </Badge>
                    }
                  />
                </div>
              </Card>

              {/* Contractor card */}
              <Card variant="default">
                <CardTitle className="mb-4">المقاول المُسنَد</CardTitle>
                {project.contractorId ? (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 rounded-full bg-gold-gradient mx-auto mb-3 flex items-center justify-center text-cinema-deepest font-black text-xl">
                      ش
                    </div>
                    <p className="text-base font-bold text-white mb-1">شركة البناء الذهبي</p>
                    <p className="text-xs text-white/50 mb-4">+966 50 123 4567</p>
                    <Button variant="outline-gold" size="sm" fullWidth>
                      فتح المحادثة
                    </Button>
                  </div>
                ) : (
                  <EmptyState
                    variant="inline"
                    icon={
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    }
                    title="لم يتم اختيار مقاول"
                    description="بعد قبول أحد العروض سيظهر هنا"
                  />
                )}
              </Card>
            </div>
          </TabsContent>

          {/* MILESTONES */}
          <TabsContent value="milestones">
            <MilestonesTab milestones={milestones} escrowTxns={escrowTxns} />
          </TabsContent>

          {/* BIDS */}
          <TabsContent value="bids">
            <BidsTab bids={bids} projectStatus={project.status} />
          </TabsContent>

          {/* ESCROW */}
          <TabsContent value="escrow">
            <EscrowTab escrowTxns={escrowTxns} milestones={milestones} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

// ═══════════════════════════════════════════════════════════════
// Helper Components
// ═══════════════════════════════════════════════════════════════

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0 gap-4">
      <span className="text-sm text-white/50">{label}</span>
      <span className="text-sm font-semibold text-white text-left">{value}</span>
    </div>
  );
}

function MilestonesTab({
  milestones,
  escrowTxns,
}: {
  milestones: Milestone[];
  escrowTxns: EscrowTransaction[];
}) {
  if (milestones.length === 0) {
    return (
      <Card variant="default">
        <EmptyState
          icon={
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          title="لم تُحدَّد المراحل بعد"
          description="ستظهر مراحل التنفيذ هنا بعد اعتماد المقاول"
        />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {milestones.map((m, idx) => {
        const status = milestoneStatusConfig[m.status];
        const escrow = escrowTxns.find((e) => e.milestoneId === m.id);
        const isCompleted = m.status === 'PAID' || m.status === 'APPROVED';
        const isActive = m.status === 'IN_PROGRESS' || m.status === 'SUBMITTED';

        return (
          <Card
            key={m.id}
            variant={isActive ? 'luxury' : 'default'}
            rim={isActive}
            className={cn(isCompleted && 'opacity-90')}
          >
            <div className="flex items-start gap-4">
              {/* Sequence number */}
              <div
                className={cn(
                  'shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-black',
                  isCompleted && 'bg-gold-gradient text-cinema-deepest shadow-glow-gold-sm',
                  isActive && 'bg-cinema-surface border-2 border-gold-500 text-gold-400 shadow-glow-gold-sm',
                  !isCompleted &&
                    !isActive &&
                    'bg-cinema-deep border border-white/10 text-white/40',
                )}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  m.sequenceOrder
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="text-base font-bold text-white tracking-cinema">
                    {m.titleAr}
                  </h4>
                  <Badge variant={status.variant} dot>
                    {status.label}
                  </Badge>
                </div>
                {m.description && (
                  <p className="text-sm text-white/60 mb-3 leading-relaxed">{m.description}</p>
                )}

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
                  <div>
                    <span className="text-white/40">الدفعة: </span>
                    <span className="font-bold text-gold-300">
                      {formatCurrency(Number(m.amount))}
                    </span>
                  </div>
                  {m.dueDate && (
                    <div>
                      <span className="text-white/40">الموعد: </span>
                      <span className="font-semibold text-white">{formatDate(m.dueDate)}</span>
                    </div>
                  )}
                  {escrow && (
                    <div>
                      <span className="text-white/40">الضمان: </span>
                      <Badge variant={escrowStatusConfig[escrow.status].variant} className="!py-0.5">
                        {escrowStatusConfig[escrow.status].label}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Action buttons for current milestone */}
                {m.status === 'SUBMITTED' && (
                  <div className="mt-4 flex items-center gap-2">
                    <Button variant="gold" size="sm">
                      اعتماد المرحلة
                    </Button>
                    <Button variant="ghost" size="sm">
                      طلب تعديلات
                    </Button>
                  </div>
                )}
                {m.status === 'PENDING' && !escrow && idx > 0 && (
                  <div className="mt-4">
                    <Button variant="outline-gold" size="sm">
                      إيداع دفعة الضمان
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function BidsTab({ bids, projectStatus }: { bids: Bid[]; projectStatus: string }) {
  if (bids.length === 0) {
    return (
      <Card variant="default">
        <EmptyState
          icon={
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          title={
            projectStatus === 'DRAFT'
              ? 'انشر مشروعك لاستقبال العروض'
              : 'لم تصل عروض بعد'
          }
          description={
            projectStatus === 'DRAFT'
              ? 'بعد نشر المشروع سيتمكن المقاولون من تقديم عروضهم'
              : 'سيتلقى المقاولون المعتمدون إشعاراً بمشروعك قريباً'
          }
        />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/50 mb-2">
        تم استلام {bids.length} عروض. قارن بينها واختر المناسب.
      </p>
      {bids.map((bid) => {
        return (
          <Card key={bid.id} variant="default">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center text-cinema-deepest font-black">
                  {bid.contractorName?.[0] || '؟'}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{bid.contractorName}</h4>
                  <div className="flex items-center gap-3 text-xs text-white/50 mt-0.5">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {bid.contractorRating}
                    </span>
                    <span>·</span>
                    <span>{bid.contractorProjects} مشروع منجز</span>
                  </div>
                </div>
              </div>
              <div className="text-left">
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">عرض السعر</p>
                <p className="text-2xl font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
                  {formatCurrency(Number(bid.amount))}
                </p>
                <p className="text-xs text-white/50 mt-1">{bid.duration} يوم تنفيذ</p>
              </div>
            </div>

            <p className="text-sm text-white/70 leading-relaxed mb-4 p-4 rounded-button bg-cinema-deep border border-white/[0.06]">
              {bid.proposal}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              {contractor?.specializations.map((spec) => (
                <Badge key={spec} variant="neutral">
                  {spec}
                </Badge>
              ))}
            </div>

            <Divider variant="subtle" className="my-4" />

            <div className="flex items-center gap-2">
              <Button variant="gold" size="sm">
                قبول العرض
              </Button>
              <Button variant="outline-gold" size="sm">
                عرض الملف الكامل
              </Button>
              <Button variant="ghost" size="sm">
                محادثة
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function EscrowTab({
  escrowTxns,
  milestones,
}: {
  escrowTxns: EscrowTransaction[];
  milestones: Milestone[];
}) {
  if (escrowTxns.length === 0) {
    return (
      <Card variant="default">
        <EmptyState
          icon={
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
          title="لم يتم إيداع أي مبالغ بعد"
          description="ستظهر معاملات الضمان المالي هنا بعد بدء المشروع"
        />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Info banner */}
      <Card variant="luxury" rim className="!p-5">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-gold-500/15 flex items-center justify-center">
            <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-white mb-1">الضمان المالي المحكم</p>
            <p className="text-sm text-white/60 leading-relaxed">
              جميع المبالغ محفوظة في حساب وسيط آمن، ولا يتم الإفراج إلا بعد اعتماد المرحلة هندسياً.
              عمولة المنصة 5% تُخصم من كل دفعة عند الإفراج.
            </p>
          </div>
        </div>
      </Card>

      {/* Transactions */}
      {escrowTxns.map((txn) => {
        const milestone = milestones.find((m) => m.id === txn.milestoneId);
        const status = escrowStatusConfig[txn.status];
        return (
          <Card key={txn.id} variant="default">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs text-white/40 mb-1">معاملة #{txn.id.slice(-6)}</p>
                <h4 className="text-base font-bold text-white">
                  مرحلة #{milestone?.sequenceOrder}: {milestone?.titleAr}
                </h4>
              </div>
              <Badge variant={status.variant} dot>
                {status.label}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-button bg-cinema-deep">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">المبلغ</p>
                <p className="text-base font-bold text-white">
                  {formatCurrency(Number(txn.totalAmount))}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">عمولة المنصة</p>
                <p className="text-base font-bold text-white/80">
                  {formatCurrency(Number(txn.platformFee))}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">
                  {txn.status === 'RELEASED' ? 'مُفرَج' : 'محجوز'}
                </p>
                <p
                  className={cn(
                    'text-base font-bold',
                    txn.status === 'RELEASED' ? 'text-success' : 'text-gold-300',
                  )}
                >
                  {formatCurrency(
                    Number(
                      txn.status === 'RELEASED' ? txn.releasedAmount : txn.heldAmount,
                    ),
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 text-xs text-white/40">
              {txn.fundedAt && <span>أُودع: {formatDate(txn.fundedAt)}</span>}
              {txn.releasedAt && <span>أُفرج: {formatDate(txn.releasedAt)}</span>}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Page Wrapper
// ═══════════════════════════════════════════════════════════════

export default function ProjectDetailPage({ params }: { params: { id: string; locale: string } }) {
  return (
    <ProtectedRoute allowedRoles={['CLIENT']}>
      <ProjectDetailContent projectId={params.id} />
    </ProtectedRoute>
  );
}
