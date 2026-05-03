import type { Metadata } from 'next'
import { LegalPageShell } from '@/components/legal/LegalPageShell'
import { getTranslations } from 'next-intl/server'
import { mockContact } from '@/data/mockData'
import { coerceLocale } from '@/lib/locale'
import { localeAlternates } from '@/lib/seo'

type PageProps = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = coerceLocale(raw)
  const t = await getTranslations('legal.privacy.metadata')
  const title = t('title')
  const description = t('description')
  return {
    title,
    description,
    alternates: localeAlternates(locale, ['privacy']),
    openGraph: {
      title,
      description,
      url: `/${locale}/privacy`,
    },
  }
}

export default async function PrivacyPage() {
  const shellT = await getTranslations('legal.shell')
  const t = await getTranslations('legal.privacy')

  const emailLink = `<a class="text-stone-900 underline" href="mailto:${mockContact.email}">${mockContact.email}</a>`

  return (
    <LegalPageShell
      eyebrow={shellT('eyebrow')}
      title={t('title')}
      updatedLabel={shellT('updatedLabel', { date: t('lastUpdated') })}
    >
      <div
        dangerouslySetInnerHTML={{
          __html: t.raw('bodyHtml').replaceAll('{emailLink}', emailLink),
        }}
      />
    </LegalPageShell>
  )
}

