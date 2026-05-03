import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'nb'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
})

export type AppLocale = (typeof routing.locales)[number]

export const locales = routing.locales
export const defaultLocale = routing.defaultLocale
