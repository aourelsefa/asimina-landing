import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import { categories } from '@/data/categories'
import { coerceLocale } from '@/lib/locale'
import { localeAlternates, localizedPath } from '@/lib/seo'

type Props = {
  children: ReactNode
  params: Promise<{ locale: string; category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, locale: raw } = await params
  const locale = coerceLocale(raw)
  const cat = categories.find((c) => c.slug === category)
  if (!cat) {
    return { title: 'Not found' }
  }
  const t = await getTranslations('categories.items')
  const title = t(`${cat.id}.pageTitle`)
  const description = t(`${cat.id}.shortDescription`)
  return {
    title,
    description,
    alternates: localeAlternates(locale, [cat.slug]),
    openGraph: {
      title,
      description,
      url: localizedPath(locale, [cat.slug]),
    },
  }
}

export default function CategoryLayout({ children }: { children: ReactNode }) {
  return children
}

