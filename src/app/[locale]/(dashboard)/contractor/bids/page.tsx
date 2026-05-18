'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Card,
  Badge,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  EmptyState,
  Divider,
  cn,
} from '@emaar/ui';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useMyBids, useProjects, useCategories } from '@/hooks/api';
import { formatCurrency, formatDate, formatRelativeDate, projectStatusConfig } from '@/lib/formatters';
import type { Bid } from '@emaar/types';

type TabValue = 'all' | 'PENDING' | 'ACCEPTED' | 'REJECTED';

const bidStatusConfig: Record<
  Bid['status'],
  { label: string; variant: 'gold' | 'success' | 'danger' | 'neutral' | 'info' }
> = {
  PENDING: { label: 'قيد المراجعة', variant: 'gold' },
  ACCEPTED: { label: 'مقبول', variant: 'success' },
  REJECTED: { label: 'مرفوض', variant: 'danger' },
};

function BidsListContent() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const [activeTab, setActiveTab] = React.useState<TabValue>('all');

  const { data: myBidsData = [] } = useMyBids();
  const { data: allProjects = [] } = useProjects();
  const { data: categories = [] } = useCategories();

  const myBids = myBidsData;

  const filteredBids = React.useMemo(() => {
    if (activeTab === 'all') return myBids;
    return myBids.filter((b) => b.status === activeTab);
  }, [activeTab, myBids]);

  const counts = {
    all: myBids.length,
    PENDING: myBids.filter((b) => b.status === 'PENDING').length,
    ACCEPTED: myBids.filter((b) => b.status === 'ACCEPTED').length,
    REJECTED: myBids.filter((b) => b.status === 'REJECTED').length,
  };

  // Win rate
  const decisive = counts.ACCEPTED + counts.REJECTED;
  const winRate = decisive > 0 ? (counts.ACCEPTED / decisive) * 100 : 0;

  const tabs: { value: TabValue; label: string }[] = [
    { value: 'all', label: 'الكل' },
    { value: 'PENDING', label: 'قيد المراجعة' },
    { value: 'ACCEPTED', label: 'مقبولة' },
    { value: 'REJECTED', label: 'مرفوضة' },
  ];

  return (
    <DashboardLayout
      role="CONTRACTOR"
      title="عروضي الفنية"
      subtitle="متابعة العروض المقدّمة"
    >
      <div className="space-y-6">
        {/* ─── Stats Summary ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card variant="default" className="!p-5">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">إجمالي العروض</p>
            <p className="text-2xl font-black text-white">{counts.all}</p>
          </Card>
          <Card variant="default" className="!p-5">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">قيد المراجعة</p>
            <p className="text-2xl font-black text-gold-300">{counts.PENDING}</p>
          </Card>
          <Card variant="default" className="!p-5">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">مقبولة</p>
            <p className="text-2xl font-black text-success">{counts.ACCEPTED}</p>
          </Card>
          <Card variant="default" className="!p-5">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">معدل الفوز</p>
            <p className="text-2xl font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
              {decisive > 0 ? `${winRate.toFixed(0)}%` : '—'}
            </p>
          </Card>
        </div>

        {/* ─── Tabs + List ─── */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                badge={
                  counts[tab.value] > 0 ? (
                    <Badge variant={activeTab === tab.value ? 'neutral' : 'gold'} className="!py-0.5">
                      {counts[tab.value]}
                    </Badge>
                  ) : null
                }
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {filteredBids.length === 0 ? (
                <Card variant="default">
                  <EmptyState
                    icon={
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    }
                    title="لا توجد عروض في هذه الفئة"
                    description="ابدأ بتصفُّح المشاريع المتاحة وتقديم عروضك"
                    action={
                      <Link href={`/${locale}/contractor/projects`}>
                        <Button variant="gold">تصفُّح الفرص</Button>
                      </Link>
                    }
                  />
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredBids.map((bid) => {
                    const project = allProjects.find((p) => p.id === bid.projectId);
                    if (!project) return null;
                    const category = categories.find((c) => c.id === project.categoryId);
                    const projectStatus = projectStatusConfig[project.status];
                    const bidStatus = bidStatusConfig[bid.status];

                    const competitorCount = myBidsData.filter(
                      (b) => b.projectId === bid.projectId && b.contractorId !== bid.contractorId,
                    ).length;

                    return (
                      <Card
                        key={bid.id}
                        variant={bid.status === 'ACCEPTED' ? 'luxury' : 'default'}
                        rim={bid.status === 'ACCEPTED'}
                      >
                        <div className="flex items-start gap-4">
                          {/* Category icon */}
                          <div className="w-14 h-14 rounded-xl bg-gold-500/10 flex items-center justify-center text-3xl shrink-0">
                            {category?.icon || '🏗️'}
                          </div>

                          {/* Main */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                              <div>
                                <Link
                                  href={`/${locale}/contractor/projects/${project.id}`}
                                  className="text-lg font-bold text-white tracking-cinema hover:text-gold-300 transition"
                                >
                                  {project.titleAr}
                                </Link>
                                <p className="text-xs text-white/40 mt-0.5">
                                  #{project.id.slice(-6)} · {category?.nameAr}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={projectStatus.variant} dot>
                                  {projectStatus.label}
                                </Badge>
                                <Badge variant={bidStatus.variant} dot>
                                  {bidStatus.label}
                                </Badge>
                              </div>
                            </div>

                            <p className="text-sm text-white/60 line-clamp-2 mb-4 leading-relaxed">
                              {bid.proposal}
                            </p>

                            <Divider variant="subtle" className="my-3" />

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">عرضي</p>
                                <p className="text-base font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
                                  {formatCurrency(Number(bid.amount))}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">المدة</p>
                                <p className="text-base font-bold text-white">{bid.duration} يوم</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">المنافسون</p>
                                <p className="text-base font-bold text-white">{competitorCount}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">قُدّم</p>
                                <p className="text-sm font-semibold text-white">
                                  {formatRelativeDate(bid.createdAt)}
                                </p>
                              </div>
                            </div>

                            <div
                              className={cn(
                                'flex items-center gap-3 mt-5 pt-4 border-t border-white/[0.06]',
                              )}
                            >
                              <Link
                                href={
                                  bid.status === 'ACCEPTED'
                                    ? `/${locale}/contractor/active/${project.id}`
                                    : `/${locale}/contractor/projects/${project.id}`
                                }
                              >
                                <Button variant="outline-gold" size="sm">
                                  {bid.status === 'ACCEPTED' ? 'فتح المشروع' : 'عرض المشروع'}
                                </Button>
                              </Link>
                              {bid.status === 'PENDING' && (
                                <Button variant="ghost" size="sm">
                                  تعديل العرض
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

export default function ContractorBidsPage() {
  return (
    <ProtectedRoute allowedRoles={['CONTRACTOR']}>
      <BidsListContent />
    </ProtectedRoute>
  );
}
