'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  Button,
  Card,
  Input,
  Textarea,
  Select,
  Stepper,
  Badge,
  Divider,
  cn,
} from '@emaar/ui';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useRegions, useCategories, useCreateProject } from '@/hooks/api';
import { formatCurrency } from '@/lib/formatters';

// ─── Steps Definition ──────────────────────────────────────────
const steps = [
  { id: 'category', label: 'الفئة', description: 'نوع المشروع' },
  { id: 'details', label: 'التفاصيل', description: 'الوصف والمواصفات' },
  { id: 'budget', label: 'الميزانية', description: 'التكلفة والمدة' },
  { id: 'review', label: 'المراجعة', description: 'تأكيد ونشر' },
];

interface FormData {
  categoryId: string;
  regionId: string;
  titleAr: string;
  titleEn: string;
  description: string;
  totalBudget: string;
  startDate: string;
  expectedEnd: string;
  city: string;
  district: string;
}

const initialData: FormData = {
  categoryId: '',
  regionId: '',
  titleAr: '',
  titleEn: '',
  description: '',
  totalBudget: '',
  startDate: '',
  expectedEnd: '',
  city: '',
  district: '',
};

// ═══════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════

function NewProjectContent() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState<FormData>(initialData);
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormData, string>>>({});

  // ─── Reference data + mutation ────────────────────────────────
  const { data: regions = [] } = useRegions();
  const { data: categories = [] } = useCategories();
  const createMutation = useCreateProject();
  const isSubmitting = createMutation.isPending;

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (step === 0) {
      if (!formData.categoryId) newErrors.categoryId = 'اختر فئة المشروع';
    }
    if (step === 1) {
      if (!formData.titleAr || formData.titleAr.length < 5)
        newErrors.titleAr = 'العنوان يجب أن يكون 5 أحرف على الأقل';
      if (!formData.description || formData.description.length < 20)
        newErrors.description = 'الوصف يجب أن يكون 20 حرف على الأقل';
      if (!formData.regionId) newErrors.regionId = 'اختر المنطقة';
    }
    if (step === 2) {
      const budget = Number(formData.totalBudget);
      if (!budget || budget < 1000)
        newErrors.totalBudget = 'الميزانية يجب أن تكون 1,000 ر.س على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    }
  };

  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    createMutation.mutate(
      {
        titleAr: formData.titleAr,
        titleEn: formData.titleEn || formData.titleAr,
        description: formData.description,
        regionId: formData.regionId,
        categoryId: formData.categoryId,
        totalBudget: Number(formData.totalBudget),
        currency: 'SAR',
        address: {
          lat: 0,
          lng: 0,
          formattedAddress: formData.district || '',
          district: formData.district,
        },
        startDate: formData.startDate || undefined,
        expectedEnd: formData.expectedEnd || undefined,
      },
      {
        onSuccess: () => router.push(`/${locale}/client/projects`),
      },
    );
  };

  return (
    <DashboardLayout
      role="CLIENT"
      title="مشروع جديد"
      subtitle="إنشاء مشروع إنشائي جديد"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back link */}
        <Link
          href={`/${locale}/client/projects`}
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-gold-300 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h15" />
          </svg>
          عودة للقائمة
        </Link>

        {/* Stepper */}
        <Card variant="luxury" rim>
          <Stepper steps={steps} currentStep={currentStep} />
        </Card>

        {/* ─── Step Content ─── */}
        <Card variant="default" className="p-8 lg:p-10">
          {/* STEP 1: Category */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <Badge variant="gold" dot className="mb-3">
                  الخطوة الأولى
                </Badge>
                <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
                  ما نوع مشروعك الإنشائي؟
                </h2>
                <p className="text-white/60">
                  اختر الفئة الأقرب لطبيعة المشروع لنساعدك في الحصول على أنسب المقاولين
                </p>
              </div>

              {errors.categoryId && (
                <p className="text-xs text-danger">{errors.categoryId}</p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {categories.map((cat) => {
                  const selected = formData.categoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => update('categoryId', cat.id)}
                      className={cn(
                        'relative p-5 rounded-card text-center',
                        'bg-cinema-deep border-2 transition-all duration-300',
                        selected
                          ? 'border-gold-500 shadow-glow-gold-sm bg-gold-500/5'
                          : 'border-cinema-border hover:border-gold-500/30',
                      )}
                    >
                      {selected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-cinema-deepest"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="3"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      <div className="text-3xl mb-3">{cat.icon}</div>
                      <p
                        className={cn(
                          'text-sm font-bold tracking-cinema',
                          selected ? 'text-gold-300' : 'text-white',
                        )}
                      >
                        {cat.nameAr}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Details */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <Badge variant="gold" dot className="mb-3">
                  الخطوة الثانية
                </Badge>
                <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
                  تفاصيل المشروع
                </h2>
                <p className="text-white/60">
                  وصف واضح يساعد المقاولين على تقديم عروض دقيقة ومناسبة
                </p>
              </div>

              <Input
                label="عنوان المشروع *"
                placeholder="مثال: تشطيب فيلا حي الياسمين"
                value={formData.titleAr}
                onChange={(e) => update('titleAr', e.target.value)}
                error={errors.titleAr}
              />

              <Input
                label="العنوان بالإنجليزية (اختياري)"
                placeholder="Example: Yasmin District Villa Finishing"
                value={formData.titleEn}
                onChange={(e) => update('titleEn', e.target.value)}
                dir="ltr"
              />

              <Textarea
                label="وصف المشروع والمواصفات الفنية *"
                placeholder="اشرح طبيعة المشروع، المساحة، المتطلبات الخاصة، ومواصفات التشطيب المطلوبة..."
                rows={5}
                value={formData.description}
                onChange={(e) => update('description', e.target.value)}
                error={errors.description}
                hint="كلما كان الوصف أكثر تفصيلاً، كانت العروض أدق"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="المنطقة *"
                  placeholder="اختر المنطقة"
                  value={formData.regionId}
                  onChange={(v) => update('regionId', v)}
                  options={regions.map((r) => ({ value: r.id, label: r.nameAr }))}
                  error={errors.regionId}
                />
                <Input
                  label="الحي / المدينة الفرعية"
                  placeholder="مثال: حي الياسمين"
                  value={formData.district}
                  onChange={(e) => update('district', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 3: Budget & Timeline */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <Badge variant="gold" dot className="mb-3">
                  الخطوة الثالثة
                </Badge>
                <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
                  الميزانية والمدة الزمنية
                </h2>
                <p className="text-white/60">
                  حدد ميزانيتك التقريبية ومواعيد البدء والانتهاء المتوقعة
                </p>
              </div>

              <div>
                <Input
                  label="الميزانية الإجمالية (ر.س) *"
                  type="number"
                  inputMode="numeric"
                  placeholder="500000"
                  value={formData.totalBudget}
                  onChange={(e) => update('totalBudget', e.target.value)}
                  error={errors.totalBudget}
                  dir="ltr"
                />
                {formData.totalBudget && Number(formData.totalBudget) >= 1000 && (
                  <p className="mt-2 text-sm text-gold-300 font-semibold">
                    {formatCurrency(Number(formData.totalBudget))}
                  </p>
                )}
              </div>

              <Divider variant="subtle" className="my-2" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="تاريخ البدء المتوقع"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => update('startDate', e.target.value)}
                  dir="ltr"
                />
                <Input
                  label="تاريخ الانتهاء المتوقع"
                  type="date"
                  value={formData.expectedEnd}
                  onChange={(e) => update('expectedEnd', e.target.value)}
                  dir="ltr"
                />
              </div>

              {/* Info Card */}
              <div className="p-4 rounded-card bg-gold-500/[0.04] border border-gold-500/20">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-gold-500/15 flex items-center justify-center">
                    <svg className="w-4 h-4 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gold-300 mb-1">معلومة مهمة</p>
                    <p className="text-xs text-white/60 leading-relaxed">
                      ستُقسَّم الميزانية على مراحل تنفيذية يحدّدها المقاول ويُوافق عليها العميل.
                      تُحفظ كل دفعة في حساب وسيط آمن ولا تُفرَج إلا بعد اعتماد المرحلة هندسياً.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <Badge variant="gold" dot className="mb-3">
                  المراجعة النهائية
                </Badge>
                <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
                  راجع التفاصيل قبل النشر
                </h2>
                <p className="text-white/60">
                  تأكد من صحة البيانات قبل نشر المشروع لاستقبال العروض
                </p>
              </div>

              <Card variant="luxury" rim className="!p-6">
                <ReviewRow label="فئة المشروع">
                  {(() => {
                    const cat = categories.find((c) => c.id === formData.categoryId);
                    return cat ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="text-lg">{cat.icon}</span>
                        {cat.nameAr}
                      </span>
                    ) : '—';
                  })()}
                </ReviewRow>
                <ReviewRow label="عنوان المشروع">{formData.titleAr || '—'}</ReviewRow>
                <ReviewRow label="الوصف">
                  <span className="line-clamp-3 text-sm">{formData.description || '—'}</span>
                </ReviewRow>
                <ReviewRow label="المنطقة">
                  {regions.find((r) => r.id === formData.regionId)?.nameAr || '—'}
                  {formData.district && (
                    <span className="text-white/50"> · {formData.district}</span>
                  )}
                </ReviewRow>
                <ReviewRow label="الميزانية" highlight>
                  {formData.totalBudget ? formatCurrency(Number(formData.totalBudget)) : '—'}
                </ReviewRow>
                <ReviewRow label="الفترة الزمنية">
                  {formData.startDate && formData.expectedEnd
                    ? `${formData.startDate} → ${formData.expectedEnd}`
                    : '—'}
                </ReviewRow>
              </Card>

              <p className="text-xs text-white/40 text-center">
                بنشرك للمشروع، ستبدأ في استقبال عروض من المقاولين المعتمدين خلال ساعات.
              </p>
            </div>
          )}
        </Card>

        {/* ─── Navigation ─── */}
        <div className="flex items-center justify-between gap-4">
          {currentStep > 0 ? (
            <Button variant="ghost" size="lg" onClick={handleBack} disabled={isSubmitting}>
              ← رجوع
            </Button>
          ) : (
            <div />
          )}

          {currentStep < steps.length - 1 ? (
            <Button variant="gold" size="lg" onClick={handleNext}>
              متابعة
            </Button>
          ) : (
            <Button
              variant="gold"
              size="lg"
              onClick={handleSubmit}
              loading={isSubmitting}
            >
              نشر المشروع
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// ─── Helper: Review Row ────────────────────────────────────────
function ReviewRow({
  label,
  children,
  highlight,
}: {
  label: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/[0.06] last:border-0">
      <span className="text-sm text-white/50 font-medium shrink-0">{label}</span>
      <span
        className={cn(
          'text-left max-w-[60%]',
          highlight
            ? 'text-lg font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent'
            : 'text-sm text-white font-semibold',
        )}
      >
        {children}
      </span>
    </div>
  );
}

export default function NewProjectPage() {
  return (
    <ProtectedRoute allowedRoles={['CLIENT']}>
      <NewProjectContent />
    </ProtectedRoute>
  );
}
