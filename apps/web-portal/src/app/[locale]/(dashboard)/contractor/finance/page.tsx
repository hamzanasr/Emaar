'use client';

import * as React from 'react';
import {
  Card,
  CardTitle,
  Badge,
  StatCard,
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
import { useMyEarnings, useMilestonesForProject, useProject } from '@/hooks/api';
import { formatCurrency, formatDate, escrowStatusConfig } from '@/lib/formatters';
import type { EscrowTransaction } from '@emaar/types';

type TabValue = 'all' | 'released' | 'pending';

function FinanceContent() {
  const [activeTab, setActiveTab] = React.useState<TabValue>('all');

  const { data: myTxns = [] } = useMyEarnings();

  // Aggregate stats
  const totalEarnings = myTxns
    .filter((e) => e.status === 'RELEASED')
    .reduce((sum, e) => sum + (Number(e.releasedAmount) - Number(e.platformFee)), 0);

  const inEscrow = myTxns
    .filter((e) => e.status === 'HELD')
    .reduce((sum, e) => sum + Number(e.heldAmount), 0);

  const totalPlatformFees = myTxns
    .filter((e) => e.status === 'RELEASED')
    .reduce((sum, e) => sum + Number(e.platformFee), 0);

  const totalPipeline = myTxns.reduce(
    (sum, e) => sum + Number(e.totalAmount) - Number(e.platformFee),
    0,
  );

  // Filter by tab
  const filteredTxns = React.useMemo(() => {
    if (activeTab === 'all') return myTxns;
    if (activeTab === 'released') return myTxns.filter((t) => t.status === 'RELEASED');
    if (activeTab === 'pending')
      return myTxns.filter((t) => t.status === 'HELD' || t.status === 'CREATED' || t.status === 'FUNDED');
    return myTxns;
  }, [activeTab, myTxns]);

  const counts = {
    all: myTxns.length,
    released: myTxns.filter((t) => t.status === 'RELEASED').length,
    pending: myTxns.filter(
      (t) => t.status === 'HELD' || t.status === 'CREATED' || t.status === 'FUNDED',
    ).length,
  };

  const tabs: { value: TabValue; label: string }[] = [
    { value: 'all', label: 'كل المعاملات' },
    { value: 'released', label: 'تم استلامها' },
    { value: 'pending', label: 'قيد الانتظار' },
  ];

  return (
    <DashboardLayout role="CONTRACTOR" title="المالية" subtitle="الأرباح والمدفوعات">
      <div className="space-y-6">
        {/* ─── Hero Stats ─── */}
        <Card variant="luxury" rim>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <Badge variant="gold" dot className="mb-3">
                إجمالي الأرباح المتراكمة
              </Badge>
              <p className="text-5xl font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent mb-2">
                {formatCurrency(totalEarnings)}
              </p>
              <p className="text-sm text-white/60">
                صافي ما تم تحويله إلى حسابك بعد خصم العمولات
              </p>
            </div>
            <div className="text-left">
              <p className="text-xs text-white/50 mb-1">عمولات المنصة</p>
              <p className="text-lg font-bold text-white/70">
                {formatCurrency(totalPlatformFees)}
              </p>
              <p className="text-xs text-white/40 mt-1">5% لكل دفعة</p>
            </div>
          </div>
        </Card>

        {/* ─── Stats Grid ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-fade">
          <StatCard
            label="استُلم"
            value={formatCurrency(totalEarnings)}
            accentColor="success"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
          />
          <StatCard
            label="في الضمان"
            value={formatCurrency(inEscrow)}
            accentColor="gold"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          />
          <StatCard
            label="إجمالي العقود"
            value={formatCurrency(totalPipeline)}
            accentColor="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <StatCard
            label="عمولات المنصة"
            value={formatCurrency(totalPlatformFees)}
            accentColor="crimson"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
        </div>

        {/* ─── Bank Account Notice ─── */}
        <Card variant="default" className="border-gold-500/20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-white">الحساب البنكي</p>
                <p className="text-sm text-white/50">
                  بنك الراجحي · IBAN: SA •••• •••• •••• •••• •••• 4567
                </p>
              </div>
            </div>
            <button className="text-sm font-semibold text-gold-400 hover:text-gold-300 transition">
              تعديل ←
            </button>
          </div>
        </Card>

        {/* ─── Tabs + Transactions List ─── */}
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
              {filteredTxns.length === 0 ? (
                <Card variant="default">
                  <EmptyState
                    icon={
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    }
                    title="لا توجد معاملات"
                    description="ستظهر هنا جميع المدفوعات والمبالغ المحجوزة"
                  />
                </Card>
              ) : (
                <Card variant="default" className="!p-0 overflow-hidden">
                  <div className="divide-y divide-white/[0.04]">
                    {filteredTxns.map((txn) => (
                      <TxnRow key={txn.id} txn={txn} />
                    ))}
                  </div>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function TxnRow({ txn }: { txn: EscrowTransaction }) {
  const { data: milestones = [] } = useMilestonesForProject(txn.projectId);
  const milestone = milestones.find((m) => m.id === txn.milestoneId);
  const { data: project } = useProject(txn.projectId);
  const status = escrowStatusConfig[txn.status];
  const myShare = Number(txn.totalAmount) - Number(txn.platformFee);
  const isReleased = txn.status === 'RELEASED';

  return (
    <div
      className="flex items-center gap-4 p-5 hover:bg-white/[0.02] transition"
    >
      <div
        className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
          isReleased ? 'bg-success/15 text-success' : 'bg-gold-500/15 text-gold-400',
        )}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={isReleased ? "M5 13l4 4L19 7" : "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"}
          />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate">
          {project?.titleAr}
        </p>
        <p className="text-xs text-white/50 mt-0.5">
          مرحلة #{milestone?.sequenceOrder}: {milestone?.titleAr}
        </p>
        <div className="flex items-center gap-2 mt-2 text-[11px] text-white/40">
          <Badge variant={status.variant} className="!py-0.5">
            {status.label}
          </Badge>
          {txn.releasedAt && <span>· {formatDate(txn.releasedAt)}</span>}
          {!txn.releasedAt && txn.fundedAt && <span>· {formatDate(txn.fundedAt)}</span>}
        </div>
      </div>

      <div className="text-left shrink-0">
        <p
          className={cn(
            'text-xl font-black',
            isReleased
              ? 'text-success'
              : 'text-gold-gradient bg-gold-text bg-clip-text text-transparent',
          )}
        >
          {isReleased ? '+' : ''}
          {formatCurrency(myShare)}
        </p>
        <p className="text-[10px] text-white/40 mt-0.5">
          من {formatCurrency(Number(txn.totalAmount))}
        </p>
      </div>
    </div>
  );
}

export default function ContractorFinancePage() {
  return (
    <ProtectedRoute allowedRoles={['CONTRACTOR']}>
      <FinanceContent />
    </ProtectedRoute>
  );
}
