import type { Metadata } from 'next'
import { defaultLocale, locales, type AppLocale } from '@/i18n/routing'

/**
 * Public pathname (no origin) for `localePrefix: 'as-needed'`.
 * Default locale (en) has no `/en` prefix; Norwegian uses `/nb/...`.
 */
export function localizedPath(locale: AppLocale, segments: string[]): string {
  const suffix = segments.length ? `/${segments.join('/')}` : ''
  if (locale === defaultLocale) {
    return suffix ? suffix : '/'
  }
  return `/${locale}${suffix}`
}

/**
 * Canonical + hreflang for localized routes.
 * @param segments path segments after locale, e.g. [] for home, ['gallery'], ['blog', 'slug']
 */
export function localeAlternates(
  locale: AppLocale,
  segments: string[],
): NonNullable<Metadata['alternates']> {
  const languages: Record<string, string> = {}
  for (const loc of locales) {
    languages[loc] = localizedPath(loc, segments)
  }
  languages['x-default'] = localizedPath(defaultLocale, segments)
  return {
    canonical: localizedPath(locale, segments),
    languages,
  }
}
