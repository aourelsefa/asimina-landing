'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { ReactNode } from 'react'

type LegalPageShellProps = {
  eyebrow: string
  title: string
  children: ReactNode
  updatedLabel: string
}

export function LegalPageShell({ eyebrow, title, children, updatedLabel }: LegalPageShellProps) {
  const t = useTranslations('legal.shell')
  return (
    <main className="min-h-screen bg-[#f0efec] text-stone-900">
      {/* pt matches fixed nav height on inner pages — see gallery header */}
      <header className="border-b border-stone-200/90 bg-white px-4 pb-14 pt-32 md:pb-16 md:pt-36">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-stone-500">{eyebrow}</p>
          <h1 className="mt-3 font-serif text-3xl font-bold text-stone-900 md:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-stone-500">{updatedLabel}</p>
        </div>
      </header>
      <div className="border-b border-stone-200/80 bg-white px-4 py-12 md:px-6 md:py-16">
        <article className="prose prose-stone mx-auto max-w-3xl prose-p:text-[15px] prose-p:leading-relaxed md:prose-p:text-base prose-li:text-stone-700">
          {children}
        </article>
      </div>
      <div className="border-t border-stone-200/60 bg-[#f0efec] px-4 py-8 text-center">
        <Link href="/" className="text-sm font-medium text-stone-800 underline decoration-stone-300 underline-offset-2 hover:decoration-stone-800">
          ← {t('backToHome')}
        </Link>
      </div>
    </main>
  )
}
