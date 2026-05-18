'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Button,
  Card,
  Badge,
  EmptyState,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Skeleton,
} from '@emaar/ui';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { useProjects, useCategories } from '@/hooks/api';
import type { ProjectStatus } from '@emaar/types';

type FilterTab = 'all' | 'active' | 'bidding' | 'completed' | 'draft';

const tabsConfig: { value: FilterTab; label: string; statuses: ProjectStatus[] }[] = [
  { value: 'all', label: 'الكل', statuses: [] },
  { value: 'active', label: 'نشطة', statuses: ['IN_PROGRESS'] },
  { value: 'bidding', label: 'استقبال عروض', statuses: ['BIDDING', 'PUBLISHED'] },
  { value: 'completed', label: 'مكتملة', statuses: ['COMPLETED'] },
  { value: 'draft', label: 'مسودات', statuses: ['DRAFT'] },
];

function ProjectsListContent() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const [activeTab, setActiveTab] = React.useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');

  // ─── Data fetching ────────────────────────────────────────────
  const { data: projectsData, isLoading } = useProjects({ limit: 100 });
  const { data: categories = [] } = useCategories();
  const allProjects = projectsData?.data ?? [];

  // Filter projects
  const filteredProjects = React.useMemo(() => {
    let result = allProjects;

    // Status filter (from active tab)
    const tab = tabsConfig.find((t) => t.value === activeTab);
    if (tab && tab.statuses.length > 0) {
      result = result.filter((p) => tab.statuses.includes(p.status));
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter((p) => p.categoryId === categoryFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.titleAr.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.id.includes(q),
      );
    }

    return result;
  }, [allProjects, activeTab, categoryFilter, searchQuery]);

  // Count per tab
  const tabCounts = React.useMemo(() => {
    const counts: Record<FilterTab, number> = {
      all: allProjects.length,
      active: 0,
      bidding: 0,
      completed: 0,
      draft: 0,
    };
    allProjects.forEach((p) => {
      tabsConfig.forEach((tab) => {
        if (tab.value !== 'all' && tab.statuses.includes(p.status)) {
          counts[tab.value]++;
        }
      });
    });
    return counts;
  }, [allProjects]);

  return (
    <DashboardLayout
      role="CLIENT"
      title="مشاريعي"
      subtitle="إدارة المشاريع الإنشائية"
      actions={
        <Link href={`/${locale}/client/projects/new`}>
          <Button variant="gold" size="sm">
            + مشروع جديد
          </Button>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* ─── Filters Bar ─── */}
        <Card variant="default">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-button bg-cinema-deep border border-white/10 focus-within:border-gold-500/50 transition">
              <svg
                className="w-4 h-4 text-white/40 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في عناوين المشاريع، الوصف، أو الرقم..."
                className="flex-1 bg-transparent text-sm text-white placeholder-white/30 focus:outline-none"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className={`shrink-0 px-4 py-2 rounded-button text-xs font-semibold tracking-cinema transition ${
                  categoryFilter === 'all'
                    ? 'bg-gold-gradient text-cinema-deepest'
                    : 'bg-cinema-deep text-white/60 hover:text-white border border-white/10'
                }`}
              >
                جميع الفئات
              </button>
              {categories.slice(0, 4).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-button text-xs font-semibold tracking-cinema transition ${
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
          </div>
        </Card>

        {/* ─── Tabs ─── */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)}>
          <TabsList>
            {tabsConfig.map((tab) => (
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

          {tabsConfig.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <Card key={i} variant="default">
                      <Skeleton className="h-12 w-12 rounded-xl mb-4" variant="rect" />
                      <Skeleton variant="text" className="w-3/4 mb-2" />
                      <Skeleton variant="text" className="w-full mb-2" />
                      <Skeleton variant="text" className="w-1/2" />
                    </Card>
                  ))}
                </div>
              ) : filteredProjects.length === 0 ? (
                <Card variant="default">
                  <EmptyState
                    icon={
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    }
                    title={
                      searchQuery ? 'لا توجد نتائج لبحثك' : 'لا توجد مشاريع في هذه الفئة'
                    }
                    description={
                      searchQuery
                        ? 'جرّب كلمات بحث مختلفة أو امسح الفلاتر'
                        : 'يمكنك إنشاء مشروع جديد للبدء'
                    }
                    action={
                      !searchQuery && (
                        <Link href={`/${locale}/client/projects/new`}>
                          <Button variant="gold">إنشاء مشروع جديد</Button>
                        </Link>
                      )
                    }
                  />
                </Card>
              ) : (
                <>
                  <p className="text-sm text-white/40 mb-4">
                    عرض {filteredProjects.length} من {allProjects.length} مشروع
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-fade">
                    {filteredProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
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

export default function ProjectsListPage() {
  return (
    <ProtectedRoute allowedRoles={['CLIENT']}>
      <ProjectsListContent />
    </ProtectedRoute>
  );
}
