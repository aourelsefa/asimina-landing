import type { Metadata } from 'next'
import { defaultLocale, locales, type AppLocale } from '@/i18n/routing'

/**
 * Canonical + hreflang for locale-prefixed routes.
 * @param segments path after locale, e.g. [] for home, ['gallery'], ['blog', 'slug']
 */
export function localeAlternates(
  locale: AppLocale,
  segments: string[],
): NonNullable<Metadata['alternates']> {
  const suffix = segments.length ? `/${segments.join('/')}` : ''
  const canonicalPath = `/${locale}${suffix}`
  const languages: Record<string, string> = {}
  for (const loc of locales) {
    languages[loc] = `/${loc}${suffix}`
  }
  languages['x-default'] = `/${defaultLocale}${suffix}`
  return {
    canonical: canonicalPath,
    languages,
  }
}
