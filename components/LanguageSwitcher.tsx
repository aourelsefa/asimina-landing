'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { locales, type AppLocale } from '@/i18n/routing'

const orderedLocales: AppLocale[] = [...locales]

type Props = {
  variant?: 'dark' | 'light'
}

export default function LanguageSwitcher({ variant = 'dark' }: Props) {
  const locale = useLocale() as AppLocale
  const pathname = usePathname()
  const t = useTranslations('language')

  const shell =
    variant === 'light'
      ? 'border-gray-300/70 bg-white/80 text-gray-800'
      : 'border-white/20 bg-white/5 text-white/90'

  const active =
    variant === 'light' ? 'bg-gray-900 text-white' : 'bg-white/20 text-white'

  const inactive =
    variant === 'light'
      ? 'text-gray-700 hover:bg-gray-900/10 hover:text-gray-900'
      : 'text-white/80 hover:bg-white/10 hover:text-white'

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-md ${shell}`}
    >
      {orderedLocales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          className={`rounded-full px-2 py-1 transition ${
            l === locale ? active : inactive
          }`}
        >
          {t(l)}
        </Link>
      ))}
    </div>
  )
}

