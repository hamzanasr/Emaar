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
  Textarea,
  EmptyState,
  cn,
} from '@emaar/ui';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useProject, useMilestonesForProject, useProjectEscrow, useRegions, useCategories } from '@/hooks/api';
import {
  formatCurrency,
  formatDate,
  projectStatusConfig,
  milestoneStatusConfig,
  escrowStatusConfig,
} from '@/lib/formatters';
import type { Milestone, EscrowTransaction } from '@emaar/types';

// ═══════════════════════════════════════════════════════════════
// Active Project Content
// ═══════════════════════════════════════════════════════════════

function ActiveProjectContent({ projectId }: { projectId: string }) {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const { data: project } = useProject(projectId);
  const { data: milestones = [] } = useMilestonesForProject(projectId);
  const { data: escrowTxns = [] } = useProjectEscrow(projectId);
  const { data: regions = [] } = useRegions();
  const { data: categories = [] } = useCategories();

  if (!project) notFound();

  const status = projectStatusConfig[project.status];
  const category = categories.find((c) => c.id === project.categoryId);
  const region = regions.find((r) => r.id === project.regionId);

  const completed = milestones.filter(
    (m) => m.status === 'PAID' || m.status === 'APPROVED',
  ).length;
  const progress = milestones.length > 0 ? (completed / milestones.length) * 100 : 0;

  // My earnings
  const earnings = escrowTxns
    .filter((e) => e.status === 'RELEASED')
    .reduce((sum, e) => sum + (Number(e.releasedAmount) - Number(e.platformFee)), 0);
  const inEscrow = escrowTxns
    .filter((e) => e.status === 'HELD')
    .reduce((sum, e) => sum + Number(e.heldAmount), 0);

  const [activeTab, setActiveTab] = React.useState('milestones');

  // Find the next actionable milestone (IN_PROGRESS or REJECTED)
  const actionMilestone = milestones.find(
    (m) => m.status === 'IN_PROGRESS' || m.status === 'REJECTED',
  );

  return (
    <DashboardLayout
      role="CONTRACTOR"
      title={project.titleAr}
      subtitle={`#${project.id.slice(-6)} · ${category?.nameAr || ''}`}
      actions={
        <Button variant="outline-gold" size="sm">
          محادثة العميل
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Back link */}
        <Link
          href={`/${locale}/contractor`}
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-gold-300 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h15" />
          </svg>
          عودة للوحة المعلومات
        </Link>

        {/* ─── Hero Card ─── */}
        <Card variant="luxury" rim>
          <div className="flex flex-col lg:flex-row items-start gap-6">
            <div className="w-20 h-20 rounded-card-lg bg-gold-500/10 flex items-center justify-center text-5xl shrink-0">
              {category?.icon || '🏗️'}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
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
                  {region?.nameAr}
                  {project.address?.formattedAddress && (
                    <span className="text-white/40">· {project.address.formattedAddress}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Divider variant="gold" className="my-6" />

          <ProgressBar value={progress} variant="gold" showLabel />
        </Card>

        {/* ─── Action Required Banner ─── */}
        {actionMilestone && (
          <Card variant="default" className="border-gold-500/30 bg-gold-500/[0.04]">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-full bg-gold-500/15 flex items-center justify-center animate-glow-pulse">
                <svg className="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-gold-300 mb-1">إجراء مطلوب منك</p>
                <p className="text-sm text-white/70 mb-3">
                  المرحلة "{actionMilestone.titleAr}" {' '}
                  {actionMilestone.status === 'REJECTED'
                    ? 'تحتاج إلى تعديلات قبل إعادة التسليم'
                    : 'قيد التنفيذ — جهّز التسليم لاعتمادها'}
                </p>
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => {
                    setActiveTab('milestones');
                    document.getElementById(`milestone-${actionMilestone.id}`)?.scrollIntoView({
                      behavior: 'smooth',
                    });
                  }}
                >
                  فتح المرحلة
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* ─── Stats ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card variant="default" className="!p-5">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">قيمة العقد</p>
            <p className="text-xl font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
              {formatCurrency(Number(project.totalBudget))}
            </p>
          </Card>
          <Card variant="default" className="!p-5">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">مكتمل</p>
            <p className="text-xl font-bold text-white">
              {completed} <span className="text-white/40">/</span> {milestones.length}
            </p>
          </Card>
          <Card variant="default" className="!p-5">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">أرباحي حتى الآن</p>
            <p className="text-xl font-bold text-success">{formatCurrency(earnings)}</p>
          </Card>
          <Card variant="default" className="!p-5">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">في الضمان</p>
            <p className="text-xl font-bold text-gold-300">{formatCurrency(inEscrow)}</p>
          </Card>
        </div>

        {/* ─── Tabs ─── */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="milestones">المراحل التنفيذية</TabsTrigger>
            <TabsTrigger value="escrow">الضمان المالي</TabsTrigger>
            <TabsTrigger value="info">معلومات المشروع</TabsTrigger>
          </TabsList>

          <TabsContent value="milestones">
            <MilestonesPanel milestones={milestones} escrowTxns={escrowTxns} />
          </TabsContent>

          <TabsContent value="escrow">
            <EscrowPanel escrowTxns={escrowTxns} milestones={milestones} />
          </TabsContent>

          <TabsContent value="info">
            <Card variant="default">
              <CardTitle className="mb-4">معلومات المشروع</CardTitle>
              <div className="space-y-1">
                <DetailRow label="فئة المشروع" value={category?.nameAr || '—'} />
                <DetailRow label="المنطقة" value={region?.nameAr || '—'} />
                <DetailRow label="العنوان" value={project.address?.formattedAddress || '—'} />
                <DetailRow
                  label="تاريخ البدء"
                  value={project.startDate ? formatDate(project.startDate) : '—'}
                />
                <DetailRow
                  label="تاريخ الانتهاء المتوقع"
                  value={project.expectedEnd ? formatDate(project.expectedEnd) : '—'}
                />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

// ═══════════════════════════════════════════════════════════════
// Milestones Panel — Contractor's view with submit actions
// ═══════════════════════════════════════════════════════════════

function MilestonesPanel({
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
            </svg>
          }
          title="لم تُحدَّد المراحل بعد"
          description="ستظهر المراحل التنفيذية فور إعدادها من قِبل العميل"
        />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {milestones.map((m) => {
        const status = milestoneStatusConfig[m.status];
        const escrow = escrowTxns.find((e) => e.milestoneId === m.id);
        const isCompleted = m.status === 'PAID' || m.status === 'APPROVED';
        const isActive = m.status === 'IN_PROGRESS' || m.status === 'REJECTED';
        const canSubmit = m.status === 'IN_PROGRESS' || m.status === 'REJECTED';

        return (
          <MilestoneItem
            key={m.id}
            milestone={m}
            escrow={escrow}
            isCompleted={isCompleted}
            isActive={isActive}
            canSubmit={canSubmit}
            statusLabel={status.label}
            statusVariant={status.variant}
          />
        );
      })}
    </div>
  );
}

// ─── Single Milestone Item ────────────────────────────────────
function MilestoneItem({
  milestone,
  escrow,
  isCompleted,
  isActive,
  canSubmit,
  statusLabel,
  statusVariant,
}: {
  milestone: Milestone;
  escrow?: EscrowTransaction;
  isCompleted: boolean;
  isActive: boolean;
  canSubmit: boolean;
  statusLabel: string;
  statusVariant: 'gold' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}) {
  const [isExpanded, setIsExpanded] = React.useState(isActive);
  const [submitNote, setSubmitNote] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // TODO: API call
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setIsExpanded(false);
    setSubmitNote('');
  };

  return (
    <Card
      id={`milestone-${milestone.id}`}
      variant={isActive ? 'luxury' : 'default'}
      rim={isActive}
      className={cn(isCompleted && 'opacity-90')}
    >
      <div className="flex items-start gap-4">
        {/* Sequence circle */}
        <div
          className={cn(
            'shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-black',
            isCompleted && 'bg-gold-gradient text-cinema-deepest shadow-glow-gold-sm',
            isActive &&
              'bg-cinema-surface border-2 border-gold-500 text-gold-400 shadow-glow-gold-sm',
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
            milestone.sequenceOrder
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className="text-base font-bold text-white tracking-cinema">
              {milestone.titleAr}
            </h4>
            <Badge variant={statusVariant} dot>
              {statusLabel}
            </Badge>
          </div>

          {milestone.description && (
            <p className="text-sm text-white/60 mb-3 leading-relaxed">
              {milestone.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
            <div>
              <span className="text-white/40">الدفعة: </span>
              <span className="font-bold text-gold-300">
                {formatCurrency(Number(milestone.amount))}
              </span>
            </div>
            {milestone.dueDate && (
              <div>
                <span className="text-white/40">الموعد: </span>
                <span className="font-semibold text-white">{formatDate(milestone.dueDate)}</span>
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

          {/* Action area for active milestones */}
          {canSubmit && (
            <div className="mt-5">
              {!isExpanded ? (
                <Button variant="gold" size="sm" onClick={() => setIsExpanded(true)}>
                  تسليم المرحلة للمراجعة
                </Button>
              ) : (
                <div className="space-y-4 p-4 rounded-card bg-cinema-deep border border-gold-500/30">
                  <div>
                    <p className="text-sm font-bold text-gold-300 mb-1">تسليم المرحلة</p>
                    <p className="text-xs text-white/50">
                      ارفع صور وفيديوهات الإنجاز مع طابع زمني وموقع جغرافي
                    </p>
                  </div>

                  {/* Upload area */}
                  <div className="border-2 border-dashed border-white/15 rounded-card p-6 text-center hover:border-gold-500/40 transition cursor-pointer">
                    <svg className="w-10 h-10 text-white/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm font-semibold text-white/80 mb-1">
                      اسحب الصور هنا أو اضغط للاختيار
                    </p>
                    <p className="text-xs text-white/40">
                      JPG, PNG, MP4 · حتى 50 ميجابايت لكل ملف
                    </p>
                  </div>

                  <Textarea
                    label="ملاحظات إضافية (اختياري)"
                    rows={3}
                    placeholder="أي ملاحظات تخص هذه المرحلة..."
                    value={submitNote}
                    onChange={(e) => setSubmitNote(e.target.value)}
                  />

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsExpanded(false)}
                      disabled={isSubmitting}
                    >
                      إلغاء
                    </Button>
                    <Button
                      variant="gold"
                      size="sm"
                      onClick={handleSubmit}
                      loading={isSubmitting}
                      fullWidth
                    >
                      تأكيد التسليم للمراجعة
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {milestone.status === 'SUBMITTED' && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gold-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              في انتظار اعتماد العميل والمراجعة الهندسية
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// Escrow Panel
// ═══════════════════════════════════════════════════════════════

function EscrowPanel({
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          }
          title="لا توجد معاملات بعد"
          description="ستظهر معاملات الضمان فور إيداع العميل لأي مرحلة"
        />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Info */}
      <Card variant="luxury" rim className="!p-5">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-gold-500/15 flex items-center justify-center">
            <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-white mb-1">حقوقك المالية محفوظة</p>
            <p className="text-sm text-white/60 leading-relaxed">
              المبالغ المحجوزة في حساب الضمان لا يستطيع العميل سحبها. فور اعتماد المرحلة،
              يتم تحويل صافي المبلغ (بعد خصم 5% عمولة المنصة) إلى حسابك خلال 24 ساعة.
            </p>
          </div>
        </div>
      </Card>

      {/* Transactions */}
      {escrowTxns.map((txn) => {
        const milestone = milestones.find((m) => m.id === txn.milestoneId);
        const status = escrowStatusConfig[txn.status];
        const myShare = Number(txn.totalAmount) - Number(txn.platformFee);

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
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">قيمة المرحلة</p>
                <p className="text-base font-bold text-white">
                  {formatCurrency(Number(txn.totalAmount))}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">عمولة المنصة (5%)</p>
                <p className="text-base font-bold text-white/60">
                  -{formatCurrency(Number(txn.platformFee))}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gold-300 uppercase tracking-widest mb-1">
                  {txn.status === 'RELEASED' ? 'استلمت' : 'سأستلم'}
                </p>
                <p
                  className={cn(
                    'text-base font-black',
                    txn.status === 'RELEASED'
                      ? 'text-success'
                      : 'text-gold-gradient bg-gold-text bg-clip-text text-transparent',
                  )}
                >
                  {formatCurrency(myShare)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 text-xs text-white/40">
              {txn.fundedAt && <span>أُودع: {formatDate(txn.fundedAt)}</span>}
              {txn.releasedAt && <span>تم التحويل لي: {formatDate(txn.releasedAt)}</span>}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Helper
// ═══════════════════════════════════════════════════════════════

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0 gap-4">
      <span className="text-sm text-white/50">{label}</span>
      <span className="text-sm font-semibold text-white text-left">{value}</span>
    </div>
  );
}

export default function ContractorActiveProjectPage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  return (
    <ProtectedRoute allowedRoles={['CONTRACTOR']}>
      <ActiveProjectContent projectId={params.id} />
    </ProtectedRoute>
  );
}
