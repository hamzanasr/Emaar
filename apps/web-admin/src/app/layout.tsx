import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import '@/styles/globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'لوحة التحكم | منصة إعمار الهندسية',
  description: 'لوحة تحكم إدارة منصة إعمار الهندسية — التحكم الكامل بالمشاريع والمستخدمين',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="font-cairo antialiased bg-cinema-deepest text-white">
        {children}
      </body>
    </html>
  );
}
