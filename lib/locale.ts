import { defaultLocale, locales, type AppLocale } from '@/i18n/routing'

export function coerceLocale(locale: string): AppLocale {
  return (locales as readonly string[]).includes(locale) ? (locale as AppLocale) : defaultLocale
}
