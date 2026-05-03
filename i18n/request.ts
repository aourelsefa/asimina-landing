import { getRequestConfig } from 'next-intl/server'
import { defaultLocale, locales, type AppLocale } from './routing'

function isLocale(value: string): value is AppLocale {
  return (locales as readonly string[]).includes(value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function deepMerge(base: Record<string, unknown>, override: Record<string, unknown>) {
  const result: Record<string, unknown> = { ...base }
  for (const [key, value] of Object.entries(override)) {
    const baseValue = result[key]
    if (isRecord(baseValue) && isRecord(value)) {
      result[key] = deepMerge(baseValue, value)
      continue
    }
    result[key] = value
  }
  return result
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale: AppLocale = requested && isLocale(requested) ? requested : defaultLocale

  const en = (await import('../messages/en.json')).default as Record<string, unknown>
  const localized = locale === 'en'
    ? en
    : ((await import(`../messages/${locale}.json`)).default as Record<string, unknown>)

  return {
    locale,
    messages: locale === 'en' ? en : deepMerge(en, localized),
  }
})

