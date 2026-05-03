import createMiddleware from 'next-intl/middleware'
import { defaultLocale, locales } from './i18n/routing'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
})

export const config = {
  // Match all pathnames except for:
  // - API routes
  // - Next.js internals
  // - static files
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}

