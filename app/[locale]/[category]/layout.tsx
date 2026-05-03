import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import { categories } from '@/data/categories'

type Props = {
  children: ReactNode
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = categories.find((c) => c.slug === category)
  if (!cat) {
    return { title: 'Not found' }
  }
  const t = await getTranslations('categories.items')
  return {
    title: t(`${cat.id}.pageTitle`),
    description: t(`${cat.id}.shortDescription`),
  }
}

export default function CategoryLayout({ children }: { children: ReactNode }) {
  return children
}

