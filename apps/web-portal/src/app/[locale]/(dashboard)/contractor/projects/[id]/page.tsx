'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, notFound, useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardTitle,
  Input,
  Textarea,
  Badge,
  Divider,
  cn,
} from '@emaar/ui';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import {
  useProject,
  useProjectBids,
  useCategories,
  useRegions,
  useCreateBid,
  useMyBids,
} from '@/hooks/api';
import {
  formatCurrency,
  formatDate,
  formatRelativeDate,
  projectStatusConfig,
} from '@/lib/formatters';

function ProjectDetailContent({ projectId }: { projectId: string }) {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'ar';

  // ─── Data fetching ────────────────────────────────────────────
  const { data: project, isLoading } = useProject(projectId);
  const { data: allBids = [] } = useProjectBids(projectId);
  const { data: categories = [] } = useCategories();
  const { data: regions = [] } = useRegions();
  const createBidMutation = useCreateBid(projectId);

  if (isLoading) {
    return (
      <DashboardLayout role="CONTRACTOR" title="جارٍ التحميل...">
        <div className="text-center py-20 text-white/50">جارٍ تحميل تفاصيل المشروع</div>
      </DashboardLayout>
    );
  }
  if (!project) notFound();

  const status = projectStatusConfig[project.status];
  const category = categories.find((c) => c.id === project.categoryId);
  const region = regions.find((r) => r.id === project.regionId);

  const { data: myBids = [] } = useMyBids();

  const myBid = myBids.find((b) => b.projectId === projectId);
  const competitorCount = allBids.filter(
    (b) => b.contractorId !== myBid?.contractorId,
  ).length;

  // Bid form state
  const [showBidForm, setShowBidForm] = React.useState(false);
  const [bidAmount, setBidAmount] = React.useState('');
  const [bidDuration, setBidDuration] = React.useState('');
  const [bidProposal, setBidProposal] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const totalBudget = Number(project.totalBudget);

  const validateBid = (): boolean => {
    const newErrors: Record<string, string> = {};
    const amount = Number(bidAmount);

    if (!amount || amount < 1000) {
      newErrors.amount = 'مبلغ العرض يجب أن يكون 1,000 ر.س على الأقل';
    } else if (amount > totalBudget * 1.2) {
      newErrors.amount = 'مبلغ العرض أعلى من الميزانية بكثير (>120%)';
    }

    const duration = Number(bidDuration);
    if (!duration || duration < 1) {
      newErrors.duration = 'حدد مدة التنفيذ بالأيام';
    } else if (duration > 1095) {
      newErrors.duration = 'المدة لا يمكن أن تتجاوز 3 سنوات';
    }

    if (!bidProposal || bidProposal.length < 30) {
      newErrors.proposal = 'اكتب مقترحاً مفصلاً (30 حرف على الأقل)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitBid = async () => {
    if (!validateBid()) return;
    createBidMutation.mutate(
      {
        amount: Number(bidAmount),
        duration: Number(bidDuration),
        proposal: bidProposal,
      },
      {
        onSuccess: () => router.push(`/${locale}/contractor/bids`),
      },
    );
  };
  const isSubmittingBid = createBidMutation.isPending || isSubmitting;

  // Bid amount comparison vs budget
  const bidAmountNum = Number(bidAmount);
  const amountDiff = bidAmountNum
    ? ((bidAmountNum - totalBudget) / totalBudget) * 100
    : 0;

  return (
    <DashboardLayout
      role="CONTRACTOR"
      title={project.titleAr}
      subtitle={`#${project.id.slice(-6)} · ${category?.nameAr || ''}`}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back link */}
        <Link
          href={`/${locale}/contractor/projects`}
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-gold-300 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h15" />
          </svg>
          عودة للفرص
        </Link>

        {/* ─── Hero Card ─── */}
        <Card variant="luxury" rim>
          <div className="flex flex-col lg:flex-row items-start gap-6">
            <div className="w-20 h-20 rounded-card-lg bg-gold-500/10 flex items-center justify-center text-5xl shrink-0">
              {category?.icon || '🏗️'}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                <div>
                  <p className="text-xs text-gold-300 font-semibold mb-1">{category?.nameAr}</p>
                  <h1 className="text-3xl font-black text-white tracking-tight">
                    {project.titleAr}
                  </h1>
                </div>
                <Badge variant={status.variant} dot>
                  {status.label}
                </Badge>
              </div>
              <p className="text-white/70 leading-relaxed mb-5">{project.description}</p>

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
                <div className="flex items-center gap-2 text-white/70">
                  <svg className="w-4 h-4 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  نُشر {formatRelativeDate(project.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* ─── Quick Facts ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card variant="default" className="!p-5">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">الميزانية</p>
            <p className="text-xl font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
              {formatCurrency(totalBudget)}
            </p>
          </Card>
          <Card variant="default" className="!p-5">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">المدة المتوقعة</p>
            <p className="text-xl font-bold text-white">
              {project.startDate && project.expectedEnd
                ? `${Math.ceil((new Date(project.expectedEnd).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24))} يوم`
                : '—'}
            </p>
          </Card>
          <Card variant="default" className="!p-5">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">المنافسون</p>
            <p className="text-xl font-bold text-white">{competitorCount}</p>
          </Card>
          <Card variant="default" className="!p-5">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">حالتي</p>
            {myBid ? (
              <Badge variant="gold" dot>
                قدّمت عرضاً
              </Badge>
            ) : (
              <Badge variant="neutral">لم أقدّم بعد</Badge>
            )}
          </Card>
        </div>

        {/* ─── My Existing Bid (if exists) ─── */}
        {myBid && (
          <Card variant="luxury" rim>
            <div className="flex items-center justify-between mb-4">
              <div>
                <Badge variant="gold" dot className="mb-2">
                  عرضك الحالي
                </Badge>
                <CardTitle>تم تقديم عرضك بنجاح</CardTitle>
              </div>
              <Badge variant="info" dot>
                {myBid.status === 'PENDING' ? 'قيد المراجعة' : myBid.status}
              </Badge>
            </div>

            <Divider variant="gold" className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">عرض السعر</p>
                <p className="text-xl font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
                  {formatCurrency(Number(myBid.amount))}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">المدة المقترحة</p>
                <p className="text-xl font-bold text-white">{myBid.duration} يوم</p>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">قُدِّم</p>
                <p className="text-sm font-semibold text-white">
                  {formatDate(myBid.createdAt)}
                </p>
              </div>
            </div>

            <div className="mt-5 p-4 rounded-button bg-cinema-deep border border-white/[0.06]">
              <p className="text-xs text-white/40 mb-2">المقترح الفني</p>
              <p className="text-sm text-white/80 leading-relaxed">{myBid.proposal}</p>
            </div>
          </Card>
        )}

        {/* ─── Bid Form (if not yet bid) ─── */}
        {!myBid &&
          (project.status === 'BIDDING' || project.status === 'PUBLISHED') && (
            <Card variant="luxury" rim>
              {!showBidForm ? (
                <div className="text-center py-6">
                  <Badge variant="gold" dot className="mb-3">
                    فرصة متاحة لك
                  </Badge>
                  <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
                    قدِّم عرضك الفني الآن
                  </h2>
                  <p className="text-white/60 mb-6 max-w-lg mx-auto">
                    اعرض سعرك التنافسي ومدتك المقترحة. كلما كان عرضك مفصلاً، كانت فرصتك أعلى.
                  </p>
                  <Button variant="gold" size="lg" onClick={() => setShowBidForm(true)}>
                    تقديم عرض جديد
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <Badge variant="gold" dot className="mb-3">
                      نموذج العرض الفني
                    </Badge>
                    <h2 className="text-xl font-black text-white tracking-tight">
                      تفاصيل عرضك
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        label="مبلغ العرض (ر.س) *"
                        type="number"
                        inputMode="numeric"
                        placeholder={String(Math.round(totalBudget * 0.95))}
                        value={bidAmount}
                        onChange={(e) => {
                          setBidAmount(e.target.value);
                          setErrors((p) => ({ ...p, amount: '' }));
                        }}
                        error={errors.amount}
                        dir="ltr"
                      />
                      {bidAmount && Number(bidAmount) >= 1000 && (
                        <p
                          className={cn(
                            'mt-2 text-xs font-semibold',
                            amountDiff < -5
                              ? 'text-success'
                              : amountDiff > 5
                                ? 'text-warning'
                                : 'text-gold-300',
                          )}
                        >
                          {amountDiff < 0
                            ? `أقل من الميزانية بـ ${Math.abs(amountDiff).toFixed(1)}%`
                            : amountDiff > 0
                              ? `أعلى من الميزانية بـ ${amountDiff.toFixed(1)}%`
                              : 'مطابق للميزانية تماماً'}
                        </p>
                      )}
                    </div>

                    <Input
                      label="مدة التنفيذ (بالأيام) *"
                      type="number"
                      inputMode="numeric"
                      placeholder="180"
                      value={bidDuration}
                      onChange={(e) => {
                        setBidDuration(e.target.value);
                        setErrors((p) => ({ ...p, duration: '' }));
                      }}
                      error={errors.duration}
                      dir="ltr"
                      hint="من تاريخ بدء العمل حتى التسليم النهائي"
                    />
                  </div>

                  <Textarea
                    label="المقترح الفني *"
                    rows={6}
                    placeholder="اشرح خبراتك السابقة، الفريق، المعدات، الجدول الزمني المقترح، وأي ضمانات إضافية..."
                    value={bidProposal}
                    onChange={(e) => {
                      setBidProposal(e.target.value);
                      setErrors((p) => ({ ...p, proposal: '' }));
                    }}
                    error={errors.proposal}
                    hint="مقترح مفصل يزيد فرصتك بنسبة 60%"
                  />

                  {/* Info: platform fee */}
                  <div className="p-4 rounded-card bg-gold-500/[0.04] border border-gold-500/20">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="flex-1 text-sm">
                        <p className="font-bold text-gold-300 mb-1">عمولة المنصة</p>
                        <p className="text-white/60 leading-relaxed">
                          تُخصم نسبة 5% من قيمة كل دفعة عند الإفراج عنها.
                          {bidAmountNum >= 1000 && (
                            <>
                              {' '}
                              صافي ربحك المتوقع:{' '}
                              <span className="font-bold text-gold-300">
                                {formatCurrency(bidAmountNum * 0.95)}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => setShowBidForm(false)}
                      disabled={isSubmitting}
                    >
                      إلغاء
                    </Button>
                    <Button
                      variant="gold"
                      size="lg"
                      onClick={handleSubmitBid}
                      loading={isSubmitting}
                      fullWidth
                    >
                      تقديم العرض
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}

        {/* ─── Project Timeline / Specs ─── */}
        <Card variant="default">
          <CardTitle className="mb-4">تفاصيل المشروع</CardTitle>
          <div className="space-y-1">
            <DetailRow label="فئة المشروع" value={category?.nameAr || '—'} />
            <DetailRow label="المنطقة" value={region?.nameAr || '—'} />
            <DetailRow label="العنوان" value={project.address?.formattedAddress || '—'} />
            <DetailRow
              label="تاريخ البدء المتوقع"
              value={project.startDate ? formatDate(project.startDate) : '—'}
            />
            <DetailRow
              label="تاريخ الانتهاء المتوقع"
              value={project.expectedEnd ? formatDate(project.expectedEnd) : '—'}
            />
            <DetailRow
              label="حالة المنافسة"
              value={
                competitorCount === 0
                  ? 'كن الأول في تقديم عرض'
                  : `${competitorCount} ${competitorCount === 1 ? 'مقاول قدم عرضاً' : 'مقاولين قدّموا عروضاً'}`
              }
            />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0 gap-4">
      <span className="text-sm text-white/50">{label}</span>
      <span className="text-sm font-semibold text-white text-left">{value}</span>
    </div>
  );
}

export default function ContractorProjectDetailPage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  return (
    <ProtectedRoute allowedRoles={['CONTRACTOR']}>
      <ProjectDetailContent projectId={params.id} />
    </ProtectedRoute>
  );
}
