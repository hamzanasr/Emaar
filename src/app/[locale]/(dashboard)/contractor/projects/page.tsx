'use client';

import * as React from 'react';
import {
  Card,
  Badge,
  EmptyState,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@emaar/ui';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { OpportunityCard } from '@/components/projects/OpportunityCard';
import { useProjects, useCategories, useRegions, useMyBids, useProjectBids } from '@/hooks/api';

import type { Project } from '@emaar/types';
type SortMode = 'newest' | 'budget-desc' | 'budget-asc' | 'least-bids';
type FilterTab = 'all' | 'fresh' | 'closing-soon' | 'high-budget';

function ContractorProjectsContent() {
  const [activeTab, setActiveTab] = React.useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  const [regionFilter, setRegionFilter] = React.useState<string>('all');
  const [sortMode, setSortMode] = React.useState<SortMode>('newest');

  // ─── Data fetching ────────────────────────────────────────────
  const { data: projectsData } = useProjects({ limit: 100 });
  const { data: categories = [] } = useCategories();
  const { data: regions = [] } = useRegions();
  const allProjects = projectsData?.data ?? [];

  const { data: myBids = [] } = useMyBids();

  // Available projects = BIDDING or PUBLISHED status
  const availableProjects = React.useMemo(() => {
    let result = allProjects.filter(
      (p) => p.status === 'BIDDING' || p.status === 'PUBLISHED',
    );

    // Tab filter
    if (activeTab === 'fresh') {
      const threshold = new Date();
      threshold.setDate(threshold.getDate() - 7);
      result = result.filter((p) => new Date(p.createdAt) > threshold);
    } else if (activeTab === 'high-budget') {
      result = result.filter((p) => Number(p.totalBudget) >= 500000);
    } else if (activeTab === 'closing-soon') {
      result = result.filter(
        (p) => myBids.filter((b) => b.projectId === p.id).length >= 2,
      );
    }

    // Category
    if (categoryFilter !== 'all') {
      result = result.filter((p) => p.categoryId === categoryFilter);
    }

    // Region
    if (regionFilter !== 'all') {
      result = result.filter((p) => p.regionId === regionFilter);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.titleAr.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortMode) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'budget-desc':
          return Number(b.totalBudget) - Number(a.totalBudget);
        case 'budget-asc':
          return Number(a.totalBudget) - Number(b.totalBudget);
        case 'least-bids': {
          const aBids = myBids.filter((bd) => bd.projectId === a.id).length;
          const bBids = myBids.filter((bd) => bd.projectId === b.id).length;
          return aBids - bBids;
        }
        default:
          return 0;
      }
    });

    return result;
  }, [allProjects, activeTab, categoryFilter, regionFilter, searchQuery, sortMode, myBids]);

  // Tab counts
  const tabCounts = React.useMemo(() => {
    const all = allProjects.filter(
      (p) => p.status === 'BIDDING' || p.status === 'PUBLISHED',
    );
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - 7);
    return {
      all: all.length,
      fresh: all.filter((p) => new Date(p.createdAt) > threshold).length,
      'high-budget': all.filter((p) => Number(p.totalBudget) >= 500000).length,
      'closing-soon': all.filter(
        (p) => myBids.filter((b) => b.projectId === p.id).length >= 2,
      ).length,
    };
  }, [allProjects, myBids]);

  const tabs: { value: FilterTab; label: string }[] = [
    { value: 'all', label: 'كل الفرص' },
    { value: 'fresh', label: 'حديثة' },
    { value: 'high-budget', label: 'ميزانية عالية' },
    { value: 'closing-soon', label: 'منافسة قوية' },
  ];

  return (
    <DashboardLayout
      role="CONTRACTOR"
      title="المشاريع المتاحة"
      subtitle="فرص جديدة بانتظار عروضك"
    >
      <div className="space-y-6">
        {/* ─── Filters Bar ─── */}
        <Card variant="default">
          <div className="space-y-4">
            {/* Search + Sort */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-button bg-cinema-deep border border-white/10 focus-within:border-gold-500/50 transition">
                <svg className="w-4 h-4 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن مشروع، فئة، موقع..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/30 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50 font-medium whitespace-nowrap">ترتيب:</span>
                <select
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as SortMode)}
                  className="appearance-none px-4 py-3 pr-9 rounded-button bg-cinema-deep border border-white/10 text-sm text-white focus:outline-none focus:border-gold-500/50 cursor-pointer"
                >
                  <option value="newest" className="bg-cinema-deep">الأحدث</option>
                  <option value="budget-desc" className="bg-cinema-deep">الأعلى ميزانية</option>
                  <option value="budget-asc" className="bg-cinema-deep">الأقل ميزانية</option>
                  <option value="least-bids" className="bg-cinema-deep">الأقل منافسة</option>
                </select>
              </div>
            </div>

            {/* Category + Region */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-xs text-white/50 font-medium whitespace-nowrap">الفئة:</span>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('all')}
                  className={`shrink-0 px-3 py-1.5 rounded-button text-xs font-semibold tracking-cinema transition ${
                    categoryFilter === 'all'
                      ? 'bg-gold-gradient text-cinema-deepest'
                      : 'bg-cinema-deep text-white/60 hover:text-white border border-white/10'
                  }`}
                >
                  الكل
                </button>
                {categories.slice(0, 5).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-button text-xs font-semibold tracking-cinema transition ${
                      categoryFilter === cat.id
                        ? 'bg-gold-gradient text-cinema-deepest'
                        : 'bg-cinema-deep text-white/60 hover:text-white border border-white/10'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.nameAr}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-xs text-white/50 font-medium whitespace-nowrap">المنطقة:</span>
                <button
                  type="button"
                  onClick={() => setRegionFilter('all')}
                  className={`shrink-0 px-3 py-1.5 rounded-button text-xs font-semibold transition ${
                    regionFilter === 'all'
                      ? 'bg-gold-gradient text-cinema-deepest'
                      : 'bg-cinema-deep text-white/60 hover:text-white border border-white/10'
                  }`}
                >
                  الكل
                </button>
                {regions.slice(0, 4).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRegionFilter(r.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-button text-xs font-semibold transition ${
                      regionFilter === r.id
                        ? 'bg-gold-gradient text-cinema-deepest'
                        : 'bg-cinema-deep text-white/60 hover:text-white border border-white/10'
                    }`}
                  >
                    {r.nameAr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* ─── Tabs ─── */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)}>
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                badge={
                  tabCounts[tab.value] > 0 ? (
                    <Badge variant={activeTab === tab.value ? 'neutral' : 'gold'} className="!py-0.5">
                      {tabCounts[tab.value]}
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
              {availableProjects.length === 0 ? (
                <Card variant="default">
                  <EmptyState
                    icon={
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    }
                    title={searchQuery ? 'لا توجد نتائج' : 'لا توجد فرص في هذه الفئة'}
                    description={
                      searchQuery
                        ? 'جرّب كلمات بحث مختلفة أو امسح الفلاتر'
                        : 'تابع الصفحة بانتظام — تُضاف فرص جديدة باستمرار'
                    }
                  />
                </Card>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-white/40">
                      {availableProjects.length} فرصة متاحة
                    </p>
                    <p className="text-xs text-gold-300/80">
                      {availableProjects.filter((p) => myBids.some((b) => b.projectId === p.id)).length}
                      {' '}
                      عروض قدّمتها
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-fade">
                    {availableProjects.map((p) => (
                    <OpportunityCardWithBids key={p.id} project={p} />
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function OpportunityCardWithBids({ project }: { project: Project }) {
  const { data: bids = [] } = useProjectBids(project.id);
  return <OpportunityCard project={project} bidsCount={bids.length} />;
}

export default function ContractorProjectsPage() {
  return (
    <ProtectedRoute allowedRoles={['CONTRACTOR']}>
      <ContractorProjectsContent />
    </ProtectedRoute>
  );
}
