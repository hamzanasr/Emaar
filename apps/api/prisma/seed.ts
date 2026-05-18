import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ─── Regions ─────────────────────────────────────────────
  const regions = await Promise.all([
    prisma.region.create({
      data: {
        nameAr: 'الرياض',
        nameEn: 'Riyadh',
        countryCode: 'SA',
        city: 'Riyadh',
        config: { currency: 'SAR', taxRate: 15, timezone: 'Asia/Riyadh' },
      },
    }),
    prisma.region.create({
      data: {
        nameAr: 'جدة',
        nameEn: 'Jeddah',
        countryCode: 'SA',
        city: 'Jeddah',
        config: { currency: 'SAR', taxRate: 15, timezone: 'Asia/Riyadh' },
      },
    }),
    prisma.region.create({
      data: {
        nameAr: 'الدمام',
        nameEn: 'Dammam',
        countryCode: 'SA',
        city: 'Dammam',
        config: { currency: 'SAR', taxRate: 15, timezone: 'Asia/Riyadh' },
      },
    }),
  ]);

  // ─── Categories ──────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.create({
      data: { nameAr: 'تشطيب داخلي', nameEn: 'Interior Finishing', sortOrder: 1 },
    }),
    prisma.category.create({
      data: { nameAr: 'بناء وإنشاء', nameEn: 'Construction', sortOrder: 2 },
    }),
    prisma.category.create({
      data: { nameAr: 'كهرباء وإضاءة', nameEn: 'Electrical & Lighting', sortOrder: 3 },
    }),
    prisma.category.create({
      data: { nameAr: 'سباكة', nameEn: 'Plumbing', sortOrder: 4 },
    }),
    prisma.category.create({
      data: { nameAr: 'دهانات', nameEn: 'Painting', sortOrder: 5 },
    }),
    prisma.category.create({
      data: { nameAr: 'أرضيات وسيراميك', nameEn: 'Flooring & Tiles', sortOrder: 6 },
    }),
    prisma.category.create({
      data: { nameAr: 'مطابخ ودواليب', nameEn: 'Kitchens & Cabinets', sortOrder: 7 },
    }),
    prisma.category.create({
      data: { nameAr: 'تكييف وتبريد', nameEn: 'HVAC', sortOrder: 8 },
    }),
  ]);

  // ─── Admin User ──────────────────────────────────────────
  await prisma.user.create({
    data: {
      fullNameAr: 'مدير النظام',
      fullNameEn: 'System Admin',
      phone: '+966500000000',
      email: 'admin@emaar.sa',
      role: 'SUPER_ADMIN',
      kycStatus: 'VERIFIED',
      isActive: true,
      regionId: regions[0].id,
    },
  });

  console.log('✓ Seeded regions:', regions.length);
  console.log('✓ Seeded categories:', categories.length);
  console.log('✓ Created admin user');
  console.log('Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
