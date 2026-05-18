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
  Badge,
  Divider,
  cn,
} from '@emaar/ui';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useCategories, useCurrentStore } from '@/hooks/api';
import { formatCurrency } from '@/lib/formatters';

interface FormData {
  nameAr: string;
  nameEn: string;
  categoryId: string;
  descriptionAr: string;
  price: string;
  stockQuantity: string;
  unit: string;
  isActive: boolean;
}

const initialData: FormData = {
  nameAr: '',
  nameEn: '',
  categoryId: '',
  descriptionAr: '',
  price: '',
  stockQuantity: '',
  unit: 'قطعة',
  isActive: true,
};

const unitOptions = [
  { value: 'قطعة', label: 'قطعة' },
  { value: 'متر مربع', label: 'متر مربع' },
  { value: 'متر طولي', label: 'متر طولي' },
  { value: 'كيلوجرام', label: 'كيلوجرام' },
  { value: 'لتر', label: 'لتر' },
  { value: 'علبة', label: 'علبة' },
  { value: 'كرتون', label: 'كرتون' },
  { value: 'لفة', label: 'لفة' },
];

function NewProductContent() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const { data: categories = [] } = useCategories();
  const { data: store } = useCurrentStore();

  const [formData, setFormData] = React.useState<FormData>(initialData);
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.nameAr || formData.nameAr.length < 5) {
      newErrors.nameAr = 'اسم المنتج يجب أن يكون 5 أحرف على الأقل';
    }
    if (!formData.categoryId) {
      newErrors.categoryId = 'اختر فئة المنتج';
    }
    if (!formData.descriptionAr || formData.descriptionAr.length < 20) {
      newErrors.descriptionAr = 'الوصف يجب أن يكون 20 حرف على الأقل';
    }
    const price = Number(formData.price);
    if (!price || price <= 0) {
      newErrors.price = 'أدخل سعراً صحيحاً';
    }
    const stock = Number(formData.stockQuantity);
    if (formData.stockQuantity === '' || stock < 0) {
      newErrors.stockQuantity = 'أدخل كمية المخزون';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // TODO: Replace with actual API call
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    router.push(`/${locale}/supplier/products`);
  };

  const selectedCategory = categories.find((c) => c.id === formData.categoryId);
  const priceNum = Number(formData.price);
  const commissionRate = Number(store?.commissionRate ?? 5) / 100;

  return (
    <DashboardLayout
      role="SUPPLIER"
      title="منتج جديد"
      subtitle="إضافة منتج إلى متجرك"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back link */}
        <Link
          href={`/${locale}/supplier/products`}
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-gold-300 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h15" />
          </svg>
          عودة للمنتجات
        </Link>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6" noValidate>
          {/* Main Form (left, 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Card variant="default">
              <div className="mb-6">
                <Badge variant="gold" dot className="mb-3">
                  المعلومات الأساسية
                </Badge>
                <h2 className="text-xl font-black text-white tracking-tight">
                  بيانات المنتج
                </h2>
              </div>

              <div className="space-y-5">
                <Input
                  label="اسم المنتج بالعربية *"
                  placeholder="مثال: ثريا كريستالية فاخرة"
                  value={formData.nameAr}
                  onChange={(e) => update('nameAr', e.target.value)}
                  error={errors.nameAr}
                  autoFocus
                />

                <Input
                  label="اسم المنتج بالإنجليزية (اختياري)"
                  placeholder="Example: Luxury Crystal Chandelier"
                  value={formData.nameEn}
                  onChange={(e) => update('nameEn', e.target.value)}
                  dir="ltr"
                />

                <Select
                  label="الفئة *"
                  placeholder="اختر فئة المنتج"
                  value={formData.categoryId}
                  onChange={(v) => update('categoryId', v)}
                  options={categories.map((c) => ({
                    value: c.id,
                    label: `${c.icon} ${c.nameAr}`,
                  }))}
                  error={errors.categoryId}
                />

                <Textarea
                  label="وصف المنتج *"
                  rows={5}
                  placeholder="اشرح خصائص المنتج، المواصفات الفنية، بلد المنشأ، الضمانات..."
                  value={formData.descriptionAr}
                  onChange={(e) => update('descriptionAr', e.target.value)}
                  error={errors.descriptionAr}
                  hint="وصف مفصل يساعد العملاء على اتخاذ قرار الشراء"
                />
              </div>
            </Card>

            <Card variant="default">
              <div className="mb-6">
                <Badge variant="gold" dot className="mb-3">
                  السعر والمخزون
                </Badge>
                <h2 className="text-xl font-black text-white tracking-tight">
                  التسعير
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="السعر (ر.س) *"
                  type="number"
                  inputMode="decimal"
                  placeholder="500"
                  value={formData.price}
                  onChange={(e) => update('price', e.target.value)}
                  error={errors.price}
                  dir="ltr"
                />
                <Input
                  label="كمية المخزون *"
                  type="number"
                  inputMode="numeric"
                  placeholder="100"
                  value={formData.stockQuantity}
                  onChange={(e) => update('stockQuantity', e.target.value)}
                  error={errors.stockQuantity}
                  dir="ltr"
                />
                <Select
                  label="الوحدة *"
                  value={formData.unit}
                  onChange={(v) => update('unit', v)}
                  options={unitOptions}
                />
              </div>

              {/* Commission preview */}
              {priceNum > 0 && (
                <div className="mt-5 p-4 rounded-card bg-gold-500/[0.04] border border-gold-500/20">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-white/50">سعر البيع</p>
                        <p className="font-bold text-white">
                          {formatCurrency(priceNum)} / {formData.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50">عمولة المنصة ({store?.commissionRate ?? 5}%)</p>
                        <p className="font-bold text-white/70">
                          {formatCurrency(priceNum * commissionRate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gold-300">صافي الربح للوحدة</p>
                        <p className="font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
                          {formatCurrency(priceNum * (1 - commissionRate))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <Card variant="default">
              <div className="mb-6">
                <Badge variant="gold" dot className="mb-3">
                  صور المنتج
                </Badge>
                <h2 className="text-xl font-black text-white tracking-tight">
                  الصور والوسائط
                </h2>
              </div>

              {/* Upload area */}
              <div className="border-2 border-dashed border-white/15 rounded-card p-8 text-center hover:border-gold-500/40 transition cursor-pointer">
                <svg className="w-12 h-12 text-white/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-semibold text-white/80 mb-1">
                  اسحب الصور هنا أو اضغط للاختيار
                </p>
                <p className="text-xs text-white/40">
                  JPG, PNG, WEBP · حتى 5 صور · 10 ميجابايت لكل صورة
                </p>
              </div>
              <p className="text-xs text-white/40 mt-3 text-center">
                الصورة الأولى ستظهر كصورة رئيسية للمنتج
              </p>
            </Card>
          </div>

          {/* Sidebar (right) */}
          <div className="space-y-6">
            {/* Status toggle */}
            <Card variant="luxury" rim>
              <Badge variant="gold" dot className="mb-3">
                حالة العرض
              </Badge>
              <h3 className="text-base font-bold text-white mb-4">
                هل تريد عرض المنتج للعملاء فور الحفظ؟
              </h3>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => update('isActive', true)}
                  className={cn(
                    'w-full p-3 rounded-button text-right border-2 transition',
                    formData.isActive
                      ? 'border-success bg-success/[0.08] text-white'
                      : 'border-white/10 bg-cinema-deep text-white/60 hover:border-white/20',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
                        formData.isActive ? 'bg-success border-success' : 'border-white/20',
                      )}
                    >
                      {formData.isActive && (
                        <svg className="w-3 h-3 text-cinema-deepest" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold">نشط ومعروض</p>
                      <p className="text-xs text-white/50">متاح للعملاء فوراً</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => update('isActive', false)}
                  className={cn(
                    'w-full p-3 rounded-button text-right border-2 transition',
                    !formData.isActive
                      ? 'border-gold-500 bg-gold-500/[0.05] text-white'
                      : 'border-white/10 bg-cinema-deep text-white/60 hover:border-white/20',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
                        !formData.isActive ? 'bg-gold-500 border-gold-500' : 'border-white/20',
                      )}
                    >
                      {!formData.isActive && (
                        <svg className="w-3 h-3 text-cinema-deepest" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold">مسودة</p>
                      <p className="text-xs text-white/50">مخفي عن العملاء</p>
                    </div>
                  </div>
                </button>
              </div>
            </Card>

            {/* Preview Card */}
            <Card variant="default">
              <p className="text-xs text-white/50 font-bold tracking-widest uppercase mb-4">
                معاينة المنتج
              </p>

              <div className="aspect-square -m-6 mb-4 bg-cinema-deep border-b border-white/[0.04] flex items-center justify-center">
                <div className="text-7xl">{selectedCategory?.icon || '📦'}</div>
              </div>

              {selectedCategory && (
                <p className="text-[10px] font-bold tracking-widest uppercase text-gold-300 mb-1">
                  {selectedCategory.nameAr}
                </p>
              )}

              <h4 className="text-base font-bold text-white tracking-cinema line-clamp-2 mb-3">
                {formData.nameAr || 'اسم المنتج هنا'}
              </h4>

              <Divider variant="subtle" className="my-3" />

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5">السعر</p>
                  <p className="text-lg font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
                    {priceNum > 0 ? formatCurrency(priceNum) : '— ر.س'}
                  </p>
                  <p className="text-[10px] text-white/40 mt-0.5">/ {formData.unit}</p>
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5">المخزون</p>
                  <p className="text-base font-bold text-white">
                    {formData.stockQuantity || '0'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Submit */}
            <div className="space-y-2">
              <Button
                type="submit"
                variant="gold"
                size="lg"
                fullWidth
                loading={isSubmitting}
              >
                حفظ المنتج
              </Button>
              <Link href={`/${locale}/supplier/products`}>
                <Button type="button" variant="ghost" size="lg" fullWidth disabled={isSubmitting}>
                  إلغاء
                </Button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default function NewProductPage() {
  return (
    <ProtectedRoute allowedRoles={['SUPPLIER']}>
      <NewProductContent />
    </ProtectedRoute>
  );
}
