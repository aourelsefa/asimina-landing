import type { Metadata } from 'next'
import { getMessages, setRequestLocale } from 'next-intl/server'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import FloatingSocialButton from '@/components/FloatingSocialButton'
import CookieConsent from '@/components/CookieConsent'
import IntlProvider from '@/components/IntlProvider'
import { defaultLocale, locales, type AppLocale } from '@/i18n/routing'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

function coerceLocale(locale: string): AppLocale {
  return (locales as readonly string[]).includes(locale) ? (locale as AppLocale) : defaultLocale
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = coerceLocale(raw)
  const messages = (await import(`../../messages/${locale}.json`)).default as any

  return {
    title: {
      default: messages.site?.title ?? 'Asimina Habipi Photography',
      template: `%s | ${messages.site?.title ?? 'Asimina Habipi Photography'}`,
    },
    description: messages.site?.description,
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: raw } = await params
  const locale = coerceLocale(raw)

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <IntlProvider locale={locale} messages={messages}>
      <Navigation />
      {children}
      <Footer />
      <FloatingSocialButton />
      <CookieConsent />
    </IntlProvider>
  )
}

