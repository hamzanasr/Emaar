'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Button,
  Card,
  CardTitle,
  CardDescription,
  Badge,
  Divider,
  StatCard,
  EmptyState,
  ProgressBar,
  Skeleton,
} from '@emaar/ui';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { useAuth } from '@/hooks/useAuth';
import { useProjects, useProject, useProjectEscrow } from '@/hooks/api';
import { formatCurrency, projectStatusConfig } from '@/lib/formatters';

function ClientHomeContent() {
  const { user } = useAuth();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  // ─── React Query Hooks ────────────────────────────────────────
  const { data: projectsData, isLoading: projectsLoading } = useProjects({ limit: 20 });
  const projects = projectsData?.data ?? [];

  // Find first IN_PROGRESS project for "active highlight"
  const activeProject = projects.find((p) => p.status === 'IN_PROGRESS');

  // Fetch full active project (with milestones) and its escrow
  const { data: activeProjectFull } = useProject(activeProject?.id);
  const { data: escrowTxns = [] } = useProjectEscrow(activeProject?.id);

  // Type-narrowed milestones (project may include them when fetched in detail)
  type ProjectWithMilestones = typeof activeProject & {
    milestones?: { id: string; status: string; amount: number | string }[];
  };
  const projectMilestones =
    (activeProjectFull as ProjectWithMilestones | undefined)?.milestones ?? [];

  // ─── Computed stats ───────────────────────────────────────────
  const activeProjects = projects.filter((p) => p.status === 'IN_PROGRESS').length;
  const biddingProjects = projects.filter(
    (p) => p.status === 'BIDDING' || p.status === 'PUBLISHED',
  ).length;

  const totalSpent = escrowTxns
    .filter((e) => e.status === 'RELEASED')
    .reduce((sum, e) => sum + Number(e.releasedAmount), 0);
  const inEscrow = escrowTxns
    .filter((e) => e.status === 'HELD')
    .reduce((sum, e) => sum + Number(e.heldAmount), 0);

  const completedMilestones = projectMilestones.filter(
    (m) => m.status === 'PAID' || m.status === 'APPROVED',
  ).length;
  const progress =
    projectMilestones.length > 0
      ? (completedMilestones / projectMilestones.length) * 100
      : 0;

  const recentProjects = projects.slice(0, 3);

  return (
    <DashboardLayout
      role="CLIENT"
      title="لوحة المعلومات"
      subtitle="مرحباً بعودتك"
      actions={
        <Link href={`/${locale}/client/projects/new`}>
          <Button variant="gold" size="sm">
            + مشروع جديد
          </Button>
        </Link>
      }
    >
      <div className="space-y-8">
        {/* ─── Welcome Banner ─── */}
        <Card variant="luxury" rim>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <Badge variant="gold" dot className="mb-3">
                لوحة العميل
              </Badge>
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                أهلاً بك، {user?.fullNameAr?.split(' ')[0]}
              </h2>
              <p className="text-white/60 max-w-xl leading-relaxed">
                تابع مشاريعك الإنشائية، راجع العروض، وادر مدفوعاتك بأمان كامل عبر نظام الضمان المالي.
              </p>
            </div>
            <Link href={`/${locale}/client/projects/new`}>
              <Button variant="gold" size="lg">
                ابدأ مشروعاً جديداً
              </Button>
            </Link>
          </div>
        </Card>

        {/* ─── Stats Grid ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-fade">
          <StatCard
            label="مشاريع نشطة"
            value={projectsLoading ? '...' : activeProjects}
            accentColor="success"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877" />
              </svg>
            }
          />
          <StatCard
            label="استقبال عروض"
            value={projectsLoading ? '...' : biddingProjects}
            accentColor="gold"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <StatCard
            label="مبالغ مدفوعة"
            value={formatCurrency(totalSpent)}
            accentColor="success"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
          />
          <StatCard
            label="محجوز في الضمان"
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
        {activeProject && (
          <Card variant="luxury" rim>
            <div className="flex items-start justify-between mb-5 gap-4">
              <div>
                <Badge
                  variant={projectStatusConfig[activeProject.status].variant}
                  dot
                  className="mb-2"
                >
                  المشروع النشط الحالي
                </Badge>
                <CardTitle className="text-2xl">{activeProject.titleAr}</CardTitle>
                <p className="text-sm text-white/50 mt-1">
                  {activeProject.address?.formattedAddress}
                </p>
              </div>
              <Link href={`/${locale}/client/projects/${activeProject.id}`}>
                <Button variant="outline-gold" size="sm">
                  التفاصيل
                </Button>
              </Link>
            </div>

            <Divider variant="gold" className="my-5" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">الميزانية</p>
                <p className="text-xl font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
                  {formatCurrency(Number(activeProject.totalBudget))}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">المراحل</p>
                <p className="text-xl font-bold text-white">
                  {completedMilestones} <span className="text-white/40">/</span>{' '}
                  {projectMilestones.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">الموعد المتوقع</p>
                <p className="text-sm font-semibold text-white">
                  {activeProject.expectedEnd
                    ? new Date(activeProject.expectedEnd).toLocaleDateString('ar-SA')
                    : '—'}
                </p>
              </div>
            </div>

            {projectMilestones.length > 0 && (
              <div className="mt-5">
                <ProgressBar value={progress} variant="gold" showLabel />
              </div>
            )}
          </Card>
        )}

        {/* ─── Recent Projects ─── */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white tracking-cinema">
                مشاريعك الأخيرة
              </h3>
              <p className="text-sm text-white/50 mt-1">آخر المشاريع التي أنشأتها</p>
            </div>
            <Link
              href={`/${locale}/client/projects`}
              className="text-sm font-semibold text-gold-400 hover:text-gold-300 transition flex items-center gap-1"
            >
              عرض الكل
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m-7 7h18" />
              </svg>
            </Link>
          </div>

          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <Card key={i} variant="default">
                  <Skeleton className="h-12 w-12 rounded-xl mb-4" variant="rect" />
                  <Skeleton variant="text" className="w-3/4 mb-2" />
                  <Skeleton variant="text" className="w-full mb-2" />
                  <Skeleton variant="text" className="w-1/2" />
                </Card>
              ))}
            </div>
          ) : recentProjects.length === 0 ? (
            <Card variant="default">
              <EmptyState
                icon={
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3" />
                  </svg>
                }
                title="لا توجد مشاريع بعد"
                description="ابدأ بإنشاء مشروعك الأول لتلقي عروض من أفضل المقاولين"
                action={
                  <Link href={`/${locale}/client/projects/new`}>
                    <Button variant="gold">إنشاء مشروع جديد</Button>
                  </Link>
                }
              />
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-fade">
              {recentProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function ClientHomePage() {
  return (
    <ProtectedRoute allowedRoles={['CLIENT']}>
      <ClientHomeContent />
    </ProtectedRoute>
  );
}
