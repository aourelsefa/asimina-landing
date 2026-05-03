export const locales = ['en', 'nb'] as const

export type AppLocale = (typeof locales)[number]

export const defaultLocale: AppLocale = 'en'

