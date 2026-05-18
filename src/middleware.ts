import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always', // Always show locale in URL: /ar/... or /en/...
});

export const config = {
  // Match all routes except API, _next, and static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
