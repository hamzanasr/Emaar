import { ProjectStatus, MilestoneStatus, EscrowStatus, OrderStatus } from '@emaar/types';

// ═══════════════════════════════════════════════════════════════
// Status → Display Helpers
// ═══════════════════════════════════════════════════════════════

export const projectStatusConfig: Record<
  ProjectStatus,
  { label: string; variant: 'gold' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' }
> = {
  DRAFT: { label: 'مسودة', variant: 'neutral' },
  PUBLISHED: { label: 'منشور', variant: 'info' },
  BIDDING: { label: 'استقبال عروض', variant: 'gold' },
  IN_PROGRESS: { label: 'قيد التنفيذ', variant: 'success' },
  PAUSED: { label: 'متوقف مؤقتاً', variant: 'warning' },
  COMPLETED: { label: 'مكتمل', variant: 'success' },
  CANCELLED: { label: 'ملغى', variant: 'neutral' },
  DISPUTED: { label: 'متنازع عليه', variant: 'danger' },
};

export const milestoneStatusConfig: Record<
  MilestoneStatus,
  { label: string; variant: 'gold' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' }
> = {
  PENDING: { label: 'معلّقة', variant: 'neutral' },
  IN_PROGRESS: { label: 'قيد التنفيذ', variant: 'info' },
  SUBMITTED: { label: 'مُسلَّمة للمراجعة', variant: 'gold' },
  UNDER_REVIEW: { label: 'قيد المراجعة', variant: 'warning' },
  APPROVED: { label: 'معتمدة', variant: 'success' },
  REJECTED: { label: 'تحتاج تعديلات', variant: 'danger' },
  PAID: { label: 'مدفوعة', variant: 'success' },
};

export const escrowStatusConfig: Record<
  EscrowStatus,
  { label: string; variant: 'gold' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' }
> = {
  CREATED: { label: 'بانتظار الإيداع', variant: 'warning' },
  FUNDED: { label: 'تم الإيداع', variant: 'gold' },
  HELD: { label: 'محجوز', variant: 'info' },
  RELEASED: { label: 'مُفرَج عنه', variant: 'success' },
  PARTIALLY_RELEASED: { label: 'إفراج جزئي', variant: 'gold' },
  DISPUTED: { label: 'متنازع عليه', variant: 'danger' },
  REFUNDED: { label: 'مُعاد', variant: 'neutral' },
  EXPIRED: { label: 'منتهي', variant: 'neutral' },
};

export const orderStatusConfig: Record<
  OrderStatus,
  { label: string; variant: 'gold' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' }
> = {
  PENDING: { label: 'بانتظار التأكيد', variant: 'warning' },
  CONFIRMED: { label: 'مؤكد', variant: 'info' },
  PREPARING: { label: 'قيد التجهيز', variant: 'gold' },
  SHIPPED: { label: 'في الشحن', variant: 'info' },
  DELIVERED: { label: 'مُسلَّم', variant: 'success' },
  CANCELLED: { label: 'ملغى', variant: 'neutral' },
};

// ═══════════════════════════════════════════════════════════════
// Currency Formatter
// ═══════════════════════════════════════════════════════════════

export function formatCurrency(amount: number, currency = 'SAR'): string {
  const formatter = new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ar-SA').format(value);
}

// ═══════════════════════════════════════════════════════════════
// Date Formatter
// ═══════════════════════════════════════════════════════════════

export function formatDate(date: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ar-SA', opts || { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
}

export function formatRelativeDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'الآن';
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  if (diffDays < 7) return `منذ ${diffDays} يوم`;
  return formatDate(d);
}
