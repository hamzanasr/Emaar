# دليل الهجرة من Mock Data إلى Backend

> هذا الدليل يوضح كيفية استبدال استخدامات `mock-data` المباشرة في الصفحات بـ React Query hooks.

## نظرة عامة

تم بناء طبقة كاملة من **React Query hooks** في `src/hooks/api/` تتعامل مع:

- **Mock mode**: عند `NEXT_PUBLIC_USE_MOCK_DATA=true` تُرجع البيانات من `mock-data` فوراً
- **Real backend**: عند `false` تستدعي الـ API الحقيقي

هذا يسمح بالهجرة التدريجية صفحة بصفحة دون كسر شيء.

## التبديل بين الأوضاع

```bash
# في apps/web-portal/.env.local
NEXT_PUBLIC_USE_MOCK_DATA=true   # ← مرحلة التطوير قبل ربط الـ Backend
NEXT_PUBLIC_USE_MOCK_DATA=false  # ← بعد ربط الـ Backend
```

## Hooks المتاحة

| الـ Hook | الاستخدام | المسار |
|---------|----------|--------|
| `useProjects(filters)` | قائمة المشاريع | `@/hooks/api` |
| `useProject(id)` | مشروع واحد | `@/hooks/api` |
| `useProjectBids(projectId)` | عروض المشروع | `@/hooks/api` |
| `useCreateProject()` | إنشاء مشروع | `@/hooks/api` |
| `useCreateBid(projectId)` | تقديم عرض | `@/hooks/api` |
| `useAcceptBid(projectId)` | قبول عرض | `@/hooks/api` |
| `useSubmitMilestone(pId)` | تسليم مرحلة | `@/hooks/api` |
| `useApproveMilestone(pId)` | اعتماد مرحلة | `@/hooks/api` |
| `useRejectMilestone(pId)` | رفض مرحلة | `@/hooks/api` |
| `useProjectEscrow(pId)` | معاملات الضمان | `@/hooks/api` |
| `useDepositEscrow(pId)` | إيداع ضمان | `@/hooks/api` |
| `useReleaseEscrow(pId)` | إفراج ضمان | `@/hooks/api` |
| `useProducts(filters)` | منتجات السوق | `@/hooks/api` |
| `useProduct(id)` | منتج واحد | `@/hooks/api` |
| `useStore(id)` | متجر مع منتجاته | `@/hooks/api` |
| `useRegions()` | المناطق (مع cache طويل) | `@/hooks/api` |
| `useCategories(parentId?)` | الفئات | `@/hooks/api` |
| `useNotifications()` | الإشعارات | `@/hooks/api` |

## نمط الهجرة (مثال عملي)

### قبل (Mock مباشر)

```tsx
import { mockProjects } from '@/lib/mock-data';

function MyPage() {
  const projects = mockProjects.filter((p) => p.status === 'IN_PROGRESS');
  return <div>{projects.length} مشاريع</div>;
}
```

### بعد (مع Hooks)

```tsx
import { useProjects } from '@/hooks/api';

function MyPage() {
  const { data, isLoading } = useProjects({ status: 'IN_PROGRESS' });
  const projects = data?.data ?? [];

  if (isLoading) return <Skeleton />;
  return <div>{projects.length} مشاريع</div>;
}
```

## نمط Mutations (إجراءات الكتابة)

```tsx
import { useCreateProject } from '@/hooks/api';

function NewProjectForm() {
  const createMutation = useCreateProject();

  const handleSubmit = (data) => {
    createMutation.mutate(data, {
      onSuccess: () => router.push('/ar/client/projects'),
    });
  };

  return (
    <Button loading={createMutation.isPending} onClick={handleSubmit}>
      إنشاء
    </Button>
  );
}
```

## الصفحات الجاهزة (تم تحويلها)

- ✅ `/ar/client` — لوحة العميل الرئيسية (نموذج عملي)

## الصفحات المتبقية للتحويل

ترتيب الأولوية المقترح:

### أولوية عالية (الأكثر استخداماً)
1. `/ar/client/projects` — قائمة المشاريع
2. `/ar/client/projects/new` — إنشاء مشروع (يحتاج `useCreateProject` + `useRegions` + `useCategories`)
3. `/ar/client/projects/[id]` — تفاصيل المشروع
4. `/ar/contractor` — لوحة المقاول
5. `/ar/contractor/projects` — تصفُّح الفرص
6. `/ar/contractor/projects/[id]` — تفاصيل + تقديم عرض
7. `/ar/contractor/active/[id]` — إدارة المشروع النشط
8. `/ar/contractor/bids` — متابعة العروض

### أولوية متوسطة
9. `/ar/supplier` — لوحة المورد
10. `/ar/supplier/products` — المنتجات
11. `/ar/supplier/orders` — الطلبات

### أولوية منخفضة (السوق العام)
12. `/ar/marketplace` — صفحة السوق
13. `/ar/marketplace/products/[id]` — تفاصيل المنتج
14. `/ar/marketplace/stores/[id]` — صفحة المتجر

## ملاحظات هامة

### البيانات المُستخدَمة من `mockBuyers` و `mockChatParticipants`

هذه بيانات "مساعدة" لربط أسماء المستخدمين بالـ IDs. عند ربط الـ Backend:
- ستأتي من API ضمن payload المشاريع/الطلبات (relations)
- يمكن تركها كـ fallback في وضع mock

### البيانات الموجودة لكن غير مدعومة بـ endpoint بعد

- `mockContractors` — يحتاج endpoint للحصول على معلومات المقاولين بالـ IDs
- `mockBuyers` — نفس الشيء للعملاء/المشترين
- `mockSupplierStore` — يحتاج `useCurrentStore()` hook (للمورد المُسجَّل)

**الحل المقترح:** إضافة endpoints `GET /users/:id` و `GET /suppliers/me/store` لاحقاً.

### Optimistic Updates

عند الحاجة لتحديثات فورية (مثل تحديث حالة الطلب)، استخدم `onMutate` في الـ mutations:

```tsx
const mutation = useMutation({
  mutationFn: api.updateOrderStatus,
  onMutate: async (newData) => {
    await queryClient.cancelQueries({ queryKey: queryKeys.orders.detail(id) });
    const prev = queryClient.getQueryData(queryKeys.orders.detail(id));
    queryClient.setQueryData(queryKeys.orders.detail(id), newData);
    return { prev };
  },
  onError: (err, vars, context) => {
    if (context?.prev) {
      queryClient.setQueryData(queryKeys.orders.detail(id), context.prev);
    }
  },
});
```

## اختبار الـ Backend الحقيقي

```bash
# 1. شغّل الـ Backend
cd apps/api
docker-compose up -d  # PostgreSQL + Redis
npm run db:migrate
npm run db:seed
npm run dev

# 2. عطّل mock mode
echo "NEXT_PUBLIC_USE_MOCK_DATA=false" >> apps/web-portal/.env.local

# 3. شغّل الـ Frontend
cd apps/web-portal
npm run dev

# 4. افتح http://localhost:3000/ar/client
```
