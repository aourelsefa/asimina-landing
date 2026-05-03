'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

const STORAGE_KEY = 'asimina-cookie-consent'
export type ConsentValue = 'all' | 'essential'

type StoredConsent = {
  v: 1
  choice: ConsentValue
  at: string
}

function readStored(): ConsentValue | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredConsent
    if (parsed?.v === 1 && (parsed.choice === 'all' || parsed.choice === 'essential')) {
      return parsed.choice
    }
  } catch {
    return null
  }
  return null
}

function writeStored(choice: ConsentValue) {
  const payload: StoredConsent = { v: 1, choice, at: new Date().toISOString() }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  try {
    document.documentElement.dataset.cookieConsent = choice
  } catch {
    // ignore
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const t = useTranslations('cookieConsent')

  useEffect(() => {
    const existing = readStored()
    if (existing === null) {
      setVisible(true)
    } else {
      document.documentElement.dataset.cookieConsent = existing
    }
  }, [])

  useEffect(() => {
    if (visible) {
      const pb = 'max(7rem, env(safe-area-inset-bottom, 0px))'
      document.body.style.paddingBottom = pb
      return () => {
        document.body.style.paddingBottom = ''
      }
    }
  }, [visible])

  function acceptAll() {
    writeStored('all')
    setVisible(false)
  }

  function acceptEssentialOnly() {
    writeStored('essential')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-stone-200/90 bg-stone-50/95 p-4 shadow-[0_-8px_32px_rgba(0,0,0,0.12)] backdrop-blur-md md:px-6 md:py-5"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-modal="true"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="min-w-0 flex-1 text-left">
          <p id="cookie-consent-title" className="text-sm font-semibold text-stone-900">
            {t('title')}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-stone-600 md:text-sm">
            {t.rich('description', {
              cookiePolicy: (chunks) => (
                <Link
                  href="/cookies"
                  className="font-medium text-stone-800 underline decoration-stone-300 underline-offset-2 hover:decoration-stone-800"
                >
                  {chunks}
                </Link>
              ),
              privacyPolicy: (chunks) => (
                <Link
                  href="/privacy"
                  className="font-medium text-stone-800 underline decoration-stone-300 underline-offset-2 hover:decoration-stone-800"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          <button
            type="button"
            onClick={acceptEssentialOnly}
            className="rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-stone-800 transition hover:border-stone-400 md:min-w-[8.5rem]"
          >
            {t('essentialOnly')}
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="rounded-lg border border-stone-900 bg-stone-900 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-stone-800 md:min-w-[8.5rem]"
          >
            {t('acceptAll')}
          </button>
        </div>
      </div>
    </div>
  )
}
