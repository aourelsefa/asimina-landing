import type { Metadata } from 'next'
import { LegalPageShell } from '@/components/legal/LegalPageShell'
import { getTranslations } from 'next-intl/server'
import { mockContact } from '@/data/mockData'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('legal.privacy.metadata')
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: '/privacy',
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

