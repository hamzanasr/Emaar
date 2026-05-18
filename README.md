# إعمار (Emaar) — Construction Platform

> المنصة الموحدة لقطاع المقاولات والإنشاءات والتشطيب

## الهوية البصرية

- **التصميم**: فاخر، سينمائي، مينيمالي (Luxurious, Cinematic & Minimalist)
- **الألوان**: أزرق غامق (#080D1A) + ذهبي (#C9A961) + أحمر كرمسون (#C8102E)
- **الخط**: Cairo (Google Fonts) — 8 أوزان
- **التقنيات**: Next.js 14, Tailwind CSS, Zustand, React Query

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- npm 10+

### Development Setup

```bash
# 1. Clone and install
cd emaar
npm install --legacy-peer-deps

# 2. Start infrastructure (PostgreSQL, Redis, Elasticsearch)
docker-compose up -d

# 3. Setup environment
cp apps/api/.env.example apps/api/.env
cp apps/web-portal/.env.example apps/web-portal/.env

# 4. Run database migrations
npm run db:migrate

# 5. Seed database
npm run db:seed

# 6. Start all services
npm run dev
```

### Available Services
| Service | URL |
|---------|-----|
| API | http://localhost:4000 |
| API Docs (Swagger) | http://localhost:4000/api/docs |
| Web Portal | http://localhost:3000 |
| Admin Dashboard | http://localhost:3001 |

## النسخة التجريبية (Demo Mode)

المنصة تتضمن وضع تجريبي للاختبار السريع:

- **رمز التحقق الثابت**: `1234`
- **أي رقم هاتف** يعمل للتسجيل
- **تسجيل دخول تلقائي** بدون Backend

## المميزات الرئيسية

### للعملاء (الملاك)
- إنشاء مشاريع جديدة مع تفاصيل كاملة
- متابعة سير المشروع والمراحل
- إدارة الدفعات المالية عبر الضمان
- مراجعة المخططات والتقارير

### للمقاولين
- تصفح الفرص المتاحة والمزايدة
- تقديم العروض الفنية والمالية
- رفع إثباتات الإنجاز للمراحل
- استلام المستحقات بعد الاعتماد

### للموردين
- إدارة المتجر وإضافة منتجات
- استقبال ومعالجة الطلبات
- تتبع المبيعات والإيرادات
- تقييم العملاء

## Project Structure

```
emaar/
├── apps/
│   ├── api/            # NestJS Backend (Port 4000)
│   ├── web-portal/     # Next.js Client/Contractor/Supplier Portal (Port 3000)
│   └── web-admin/      # Next.js Admin Dashboard (Port 3001)
├── packages/
│   ├── types/          # Shared TypeScript types
│   ├── config/         # Shared ESLint, Tailwind, TSConfig
│   ├── ui/             # Shared React components
│   └── utils/          # Shared utilities
├── infrastructure/     # Terraform & Kubernetes configs
├── docs/               # Architecture docs
└── docker-compose.yml  # Local development services
```

## Tech Stack
- **Backend**: NestJS + TypeScript + Prisma + PostgreSQL
- **Frontend**: Next.js 14 + Tailwind CSS + Zustand + React Query
- **Mobile**: Flutter (separate repo)
- **Real-time**: Socket.IO + Redis
- **Infrastructure**: AWS (EKS, RDS, S3, CloudFront)

## Key Features
- Escrow/Milestone-based payment system
- Quality assurance with scored inspections
- Real-time chat & notifications
- Arabic-first (RTL) with English support
- Multi-region scalable architecture

## الترخيص

MIT License - جميع الحقوق محفوظة © 2025
