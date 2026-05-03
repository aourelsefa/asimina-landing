import type { Metadata } from 'next'
import { getMessages, setRequestLocale } from 'next-intl/server'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import FloatingSocialButton from '@/components/FloatingSocialButton'
import CookieConsent from '@/components/CookieConsent'
import IntlProvider from '@/components/IntlProvider'
import { type AppLocale } from '@/i18n/routing'
import { coerceLocale } from '@/lib/locale'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

const ogLocaleMap: Record<AppLocale, string> = {
  en: 'en_GB',
  nb: 'nb_NO',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = coerceLocale(raw)
  const messages = (await import(`../../messages/${locale}.json`)).default as any
  const siteTitle = messages.site?.title ?? 'Asimina Habipi Photography'
  const siteDescription = messages.site?.description

  return {
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle}`,
    },
    description: siteDescription,
    applicationName: siteTitle,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      type: 'website',
      siteName: siteTitle,
      locale: ogLocaleMap[locale],
      alternateLocale: locale === 'en' ? ogLocaleMap.nb : ogLocaleMap.en,
      images: [
        {
          url: '/asimina-habipi-photographer-in-oslo.jpg',
          width: 1920,
          height: 1080,
          alt: siteTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDescription,
      images: ['/asimina-habipi-photographer-in-oslo.jpg'],
    },
    formatDetection: {
      telephone: true,
      email: true,
      address: true,
    },
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

