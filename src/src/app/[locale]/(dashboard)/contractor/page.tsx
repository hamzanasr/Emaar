'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Card,
  CardTitle,
  CardDescription,
  Badge,
  Button,
  StatCard,
  Divider,
  ProgressBar,
  EmptyState,
} from '@emaar/ui';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { OpportunityCard } from '@/components/projects/OpportunityCard';
import { useAuth } from '@/hooks/useAuth';
import { useMyBids, useMyEarnings, useMyProjects, useCurrentContractorProfile, useProjects, useMilestonesForProject, useProjectBids, useProject } from '@/hooks/api';
import { formatCurrency, projectStatusConfig } from '@/lib/formatters';
import type { Project, Bid } from '@emaar/types';

function ContractorHomeContent() {
  const { user } = useAuth();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  // ─── Data fetching ────────────────────────────────────────────
  const { data: myBids = [] } = useMyBids();
  const { data: myProjects = [] } = useMyProjects();
  const { data: earnings = [] } = useMyEarnings();
  const { data: profile } = useCurrentContractorProfile();
  const { data: availableData } = useProjects({ limit: 50 });

  const pendingBids = myBids.filter((b) => b.status === 'PENDING');
  const acceptedBids = myBids.filter((b) => b.status === 'ACCEPTED');
  const activeProjects = myProjects.filter((p) => p.status === 'IN_PROGRESS');
  const completedProjects = myProjects.filter((p) => p.status === 'COMPLETED');

  // Earnings
  const totalEarnings = earnings
    .filter((e) => e.status === 'RELEASED')
    .reduce((sum, e) => sum + (Number(e.releasedAmount) - Number(e.platformFee)), 0);
  const inEscrow = earnings
    .filter((e) => e.status === 'HELD')
    .reduce((sum, e) => sum + Number(e.heldAmount), 0);

  // Available opportunities (BIDDING/PUBLISHED projects, not yet bid by me)
  const allAvailable = availableData?.data ?? [];
  const availableOpportunities = allAvailable.filter(
    (p) =>
      (p.status === 'BIDDING' || p.status === 'PUBLISHED') &&
      !myBids.some((b) => b.projectId === p.id),
  );

  return (
    <DashboardLayout
      role="CONTRACTOR"
      title="لوحة المعلومات"
      subtitle="مرحباً بعودتك"
      actions={
        <Link href={`/${locale}/contractor/projects`}>
          <Button variant="gold" size="sm">
            تصفُّح الفرص
          </Button>
        </Link>
      }
    >
      <div className="space-y-8">
        {/* ─── Welcome Banner with Profile ─── */}
        <Card variant="luxury" rim>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <Badge variant="gold" dot className="mb-3">
                المقاول الهندسي
              </Badge>
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                أهلاً بك، {user?.fullNameAr?.split(' ')[0]}
              </h2>
              <p className="text-white/60 max-w-xl leading-relaxed mb-4">
                اكتشف فرصاً جديدة، أدر مشاريعك الجارية، وتابع مدفوعاتك من مكان واحد.
              </p>
              {profile && (
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-white font-bold">{profile.qualityRating}</span>
                    <span className="text-white/50">تقييم الجودة</span>
                  </div>
                  <span className="text-white/30">·</span>
                  <div className="text-white/70">
                    <span className="text-white font-bold">{profile.totalProjects}</span>{' '}
                    <span className="text-white/50">مشروع منجز</span>
                  </div>
                </div>
              )}
            </div>
            <Link href={`/${locale}/contractor/projects`}>
              <Button variant="gold" size="lg">
                تصفُّح الفرص
              </Button>
            </Link>
          </div>
        </Card>

        {/* ─── Stats Grid ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-fade">
          <StatCard
            label="مشاريع نشطة"
            value={activeProjects.length}
            accentColor="success"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877" />
              </svg>
            }
          />
          <StatCard
            label="عروض قيد المراجعة"
            value={pendingBids.length}
            accentColor="gold"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <StatCard
            label="إجمالي الأرباح"
            value={formatCurrency(totalEarnings)}
            accentColor="success"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="مستحق في الضمان"
            value={formatCurrency(inEscrow)}
            accentColor="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          />
        </div>

        {/* ─── Active Project Highlight ─── */}
        {activeProjects.length > 0 && <ActiveProjectCard project={activeProjects[0]} />}

        {/* ─── Available Opportunities ─── */}
        <AvailableOpportunitiesSection />

        {/* ─── Recent Activity Summary ─── */}
        <RecentActivitySection />
      </div>
    </DashboardLayout>
  );
}

function ActiveProjectCard({ project }: { project: Project }) {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const { data: apMilestones = [] } = useMilestonesForProject(project.id);
  const completed = apMilestones.filter(
    (m) => m.status === 'PAID' || m.status === 'APPROVED',
  ).length;
  const progress =
    apMilestones.length > 0 ? (completed / apMilestones.length) * 100 : 0;
  const status = projectStatusConfig[project.status];
  const actionMilestone = apMilestones.find(
    (m) => m.status === 'IN_PROGRESS' || m.status === 'REJECTED',
  );

  return (
    <Card variant="luxury" rim>
      <div className="flex items-start justify-between mb-5 gap-4">
        <div>
          <Badge variant={status.variant} dot className="mb-2">
            المشروع النشط الحالي
          </Badge>
          <CardTitle className="text-2xl">{project.titleAr}</CardTitle>
          <p className="text-sm text-white/50 mt-1">
            {project.address?.formattedAddress}
          </p>
        </div>
        <Link href={`/${locale}/contractor/active/${project.id}`}>
          <Button variant="outline-gold" size="sm">
            إدارة المشروع
          </Button>
        </Link>
      </div>

      <Divider variant="gold" className="my-5" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-widest mb-1">
            قيمة العقد
          </p>
          <p className="text-xl font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
            {formatCurrency(Number(project.totalBudget))}
          </p>
        </div>
        <div>
          <p className="text-xs text-white/40 uppercase tracking-widest mb-1">
            المراحل المُسلَّمة
          </p>
          <p className="text-xl font-bold text-white">
            {completed} <span className="text-white/40">/</span> {apMilestones.length}
          </p>
        </div>
        <div>
          <p className="text-xs text-white/40 uppercase tracking-widest mb-1">
            الموعد المتوقع
          </p>
          <p className="text-sm font-semibold text-white">
            {project.expectedEnd
              ? new Date(project.expectedEnd).toLocaleDateString('ar-SA')
              : '—'}
          </p>
        </div>
      </div>

      <ProgressBar value={progress} variant="gold" showLabel />

      {actionMilestone && (
        <div className="mt-5 p-4 rounded-card bg-gold-500/[0.06] border border-gold-500/30">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-gold-300 mb-1">
                ⚡ مرحلة بحاجة إجراء منك
              </p>
              <p className="text-sm text-white/70">
                {actionMilestone.titleAr} —{' '}
                {actionMilestone.status === 'REJECTED'
                  ? 'تحتاج تعديلات'
                  : 'قيد التنفيذ'}
              </p>
            </div>
            <Link href={`/${locale}/contractor/active/${project.id}`}>
              <Button variant="gold" size="sm">
                فتح المرحلة
              </Button>
            </Link>
          </div>
        </div>
      )}
    </Card>
  );
}

function AvailableOpportunitiesSection() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const { data: myBids = [] } = useMyBids();
  const { data: availableData } = useProjects({ limit: 50 });
  const allAvailable = availableData?.data ?? [];
  const availableOpportunities = allAvailable.filter(
    (p) =>
      (p.status === 'BIDDING' || p.status === 'PUBLISHED') &&
      !myBids.some((b) => b.projectId === p.id),
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white tracking-cinema">
            فرص جديدة لك
          </h3>
          <p className="text-sm text-white/50 mt-1">
            مشاريع تطابق تخصصك ولم تقدِّم عليها بعد
          </p>
        </div>
        <Link
          href={`/${locale}/contractor/projects`}
          className="text-sm font-semibold text-gold-400 hover:text-gold-300 transition flex items-center gap-1"
        >
          عرض الكل
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m-7 7h18" />
          </svg>
        </Link>
      </div>

      {availableOpportunities.length === 0 ? (
        <Card variant="default">
          <EmptyState
            icon={
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
            title="لا توجد فرص متاحة حالياً"
            description="ستصلك إشعارات فور إضافة مشاريع تناسب تخصصك"
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-fade">
          {availableOpportunities.slice(0, 3).map((p) => (
            <OpportunityCardWithBids key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function OpportunityCardWithBids({ project }: { project: Project }) {
  const { data: bids = [] } = useProjectBids(project.id);
  return <OpportunityCard project={project} bidsCount={bids.length} />;
}

function RecentActivitySection() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const { data: pendingBids = [] } = useMyBids();
  const { data: profile } = useCurrentContractorProfile();
  const { data: myProjects = [] } = useMyProjects();
  const completedProjects = myProjects.filter((p) => p.status === 'COMPLETED');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card variant="default">
        <div className="flex items-center justify-between mb-4">
          <CardTitle>عروضي الأخيرة</CardTitle>
          <Link
            href={`/${locale}/contractor/bids`}
            className="text-xs font-semibold text-gold-400 hover:text-gold-300 transition"
          >
            عرض الكل
          </Link>
        </div>
        {pendingBids.length === 0 ? (
          <EmptyState
            variant="inline"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            title="لم تقدّم عروضاً بعد"
            description="ابدأ بتصفُّح الفرص المتاحة"
          />
        ) : (
          <div className="space-y-3">
            {pendingBids.slice(0, 3).map((bid) => (
              <BidActivityItem key={bid.id} bid={bid} />
            ))}
          </div>
        )}
      </Card>

      <Card variant="default">
        <CardTitle className="mb-4">إنجازاتي</CardTitle>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-button bg-cinema-deep border border-white/[0.06]">
            <div>
              <p className="text-xs text-white/50 mb-1">المشاريع المنجزة</p>
              <p className="text-2xl font-black text-white">
                {completedProjects.length + (profile?.totalProjects || 0)}
              </p>
            </div>
            <svg className="w-10 h-10 text-success/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="flex items-center justify-between p-4 rounded-button bg-cinema-deep border border-white/[0.06]">
            <div>
              <p className="text-xs text-white/50 mb-1">معدل الجودة</p>
              <p className="text-2xl font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
                {profile?.qualityRating || 0} / 5.0
              </p>
            </div>
            <svg className="w-10 h-10 text-gold-400/40" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      </Card>
    </div>
  );
}

function BidActivityItem({ bid }: { bid: Bid }) {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const { data: project } = useProject(bid.projectId);
  return (
    <Link
      href={`/${locale}/contractor/projects/${bid.projectId}`}
      className="flex items-center justify-between p-3 rounded-button bg-cinema-deep border border-white/[0.06] hover:border-gold-500/30 transition"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate">
          {project?.titleAr}
        </p>
        <p className="text-xs text-white/50 mt-0.5">
          عرضك: {formatCurrency(Number(bid.amount))}
        </p>
      </div>
      <Badge variant="gold" dot>
        قيد المراجعة
      </Badge>
    </Link>
  );
}

export default function ContractorHomePage() {
  return (
    <ProtectedRoute allowedRoles={['CONTRACTOR']}>
      <ContractorHomeContent />
    </ProtectedRoute>
  );
}
