'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, Badge, ProgressBar, cn } from '@emaar/ui';
import type { Project } from '@emaar/types';
import { projectStatusConfig, formatCurrency, formatDate } from '@/lib/formatters';
import { useCategories, useMilestonesForProject } from '@/hooks/api';

interface ProjectCardProps {
  project: Project;
  /** Show extra metadata; default true */
  detailed?: boolean;
}

export function ProjectCard({ project, detailed = true }: ProjectCardProps) {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const { data: categories = [] } = useCategories();
  const { data: projectMilestones = [] } = useMilestonesForProject(project.id);
  const status = projectStatusConfig[project.status];
  const category = categories.find((c) => c.id === project.categoryId);

  const completedMilestones = projectMilestones.filter(
    (m) => m.status === 'PAID' || m.status === 'APPROVED',
  ).length;
  const progressPercent =
    projectMilestones.length > 0
      ? (completedMilestones / projectMilestones.length) * 100
      : 0;

  return (
    <Link href={`/${locale}/client/projects/${project.id}`} className="block group">
      <Card variant="default" className="h-full overflow-hidden">
        {/* Top: Status + Category */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-2xl">
              {category?.icon || '🏗️'}
            </div>
            <div>
              <p className="text-xs text-white/40 mb-0.5">{category?.nameAr}</p>
              <p className="text-xs font-mono text-white/30 tracking-tight">
                #{project.id.slice(-6)}
              </p>
            </div>
          </div>
          <Badge variant={status.variant} dot>
            {status.label}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 tracking-cinema line-clamp-2 group-hover:text-gold-300 transition-colors">
          {project.titleAr}
        </h3>

        {/* Description */}
        <p className="text-sm text-white/50 line-clamp-2 mb-5 leading-relaxed">
          {project.description}
        </p>

        {/* Progress (only for in-progress) */}
        {detailed && project.status === 'IN_PROGRESS' && projectMilestones.length > 0 && (
          <div className="mb-5">
            <ProgressBar value={progressPercent} variant="gold" showLabel />
          </div>
        )}

        {/* Footer: Budget + Date */}
        <div
          className={cn(
            'flex items-center justify-between pt-4 border-t border-white/[0.06]',
            !detailed && 'border-t-0 pt-0',
          )}
        >
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">الميزانية</p>
            <p className="text-base font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
              {formatCurrency(Number(project.totalBudget), project.currency)}
            </p>
          </div>
          <div className="text-left">
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">المرحلة</p>
            <p className="text-sm font-semibold text-white">
              {projectMilestones.length > 0
                ? `${completedMilestones} / ${projectMilestones.length}`
                : '—'}
            </p>
          </div>
        </div>

        {/* Date footer */}
        {detailed && (
          <p className="text-xs text-white/30 mt-3 text-left">
            أُنشئ في {formatDate(project.createdAt, { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        )}
      </Card>
    </Link>
  );
}
