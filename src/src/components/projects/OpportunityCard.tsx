'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, Badge } from '@emaar/ui';
import type { Project, Bid } from '@emaar/types';
import { formatCurrency, formatRelativeDate, projectStatusConfig } from '@/lib/formatters';
import { useCategories, useRegions, useMyBids } from '@/hooks/api';

interface OpportunityCardProps {
  project: Project;
  /** Number of competing bids on this project */
  bidsCount?: number;
}

/**
 * Opportunity card — for contractor's perspective on available projects.
 * Shows budget range, location, competing bids, and whether contractor already bid.
 */
export function OpportunityCard({ project, bidsCount }: OpportunityCardProps) {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const { data: categories = [] } = useCategories();
  const { data: regions = [] } = useRegions();
  const { data: myBids = [] } = useMyBids();

  const status = projectStatusConfig[project.status];
  const category = categories.find((c) => c.id === project.categoryId);
  const region = regions.find((r) => r.id === project.regionId);

  const myBid: Bid | undefined = myBids.find(
    (b) => b.projectId === project.id,
  );

  return (
    <Link href={`/${locale}/contractor/projects/${project.id}`} className="block group">
      <Card variant="default" className="h-full">
        {/* Top: Category + Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-2xl">
              {category?.icon || '🏗️'}
            </div>
            <div>
              <p className="text-xs text-gold-300 font-semibold mb-0.5">
                {category?.nameAr}
              </p>
              <p className="text-[10px] font-mono text-white/30 tracking-tight">
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

        {/* Location + Date */}
        <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-xs text-white/50 mb-4">
          <span className="inline-flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {region?.nameAr}
          </span>
          <span className="inline-flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatRelativeDate(project.createdAt)}
          </span>
        </div>

        {/* Footer: Budget + Bids */}
        <div className="flex items-end justify-between pt-4 border-t border-white/[0.06]">
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">الميزانية</p>
            <p className="text-base font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
              {formatCurrency(Number(project.totalBudget), project.currency)}
            </p>
          </div>
          <div className="text-left">
            {myBid ? (
              <Badge variant="gold" dot>
                قدّمت عرضاً
              </Badge>
            ) : bidsCount !== undefined ? (
              <p className="text-xs text-white/50">
                {bidsCount} {bidsCount === 1 ? 'منافس' : 'منافسين'}
              </p>
            ) : null}
          </div>
        </div>
      </Card>
    </Link>
  );
}
