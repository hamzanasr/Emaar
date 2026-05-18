import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from './providers';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'منصة إعمار الهندسية | Emaar Construction Platform',
  description:
    'منصة رقمية متكاملة لإدارة المشاريع الإنشائية، المقاولات، والاستشارات الهندسية. تربط بين الملاك، المقاولين، والموردين بأعلى معايير الجودة والشفافية.',
  keywords: [
    'منصة إعمار',
    'مقاولات',
    'إنشاءات',
    'استشارات هندسية',
    'مشاريع إنشائية',
    'Emaar',
    'Construction Platform',
  ],
  openGraph: {
    title: 'منصة إعمار الهندسية',
    description: 'الحل الموحد للمشاريع الإنشائية والاستشارات الهندسية',
    type: 'website',
    locale: 'ar_SA',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="font-cairo antialiased bg-cinema-deepest text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
