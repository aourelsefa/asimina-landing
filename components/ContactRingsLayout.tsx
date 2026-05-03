'use client'

import { useTranslations } from 'next-intl'

export type ContactRingsLayoutProps = {
  title: string
  lead: string
  email: string
  phone: string
  address: string
  /** set for in-page # navigation; use `''` to omit the section `id` */
  sectionId?: string
}

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

function MailIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function PhoneIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  )
}

function PinIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

/**
 * Concentric ring decoration, link chips for email/phone, address line — white background.
 */
export default function ContactRingsLayout({
  title,
  lead,
  email,
  phone,
  address,
  sectionId = 'contact',
}: ContactRingsLayoutProps) {
  const t = useTranslations('contactRings')
  return (
    <section
      id={sectionId || undefined}
      className="relative overflow-hidden bg-white py-32 md:py-40 lg:py-44"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(100vw,36rem)] w-[min(100vw,36rem)] -translate-x-1/2 -translate-y-1/2 md:h-[min(100vw,40rem)] md:w-[min(100vw,40rem)]">
        <div className="absolute inset-0 rounded-full border border-neutral-200/80" />
        <div className="absolute inset-[6%] rounded-full border border-neutral-200/60" />
        <div className="absolute inset-[14%] rounded-full border border-neutral-200/40" />
        <div className="absolute inset-[23%] rounded-full border border-neutral-200/30" />
      </div>
      <div className="relative mx-auto max-w-lg px-4 py-2 text-center md:py-4">
        <h2 className="font-serif text-3xl text-neutral-900 md:text-5xl">{title}</h2>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-neutral-600 md:mt-8 md:text-base md:leading-relaxed">
          {lead}
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 md:mt-16 md:gap-4">
          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex max-w-full items-center gap-2.5 border border-neutral-800 bg-white px-4 py-2.5 text-left text-sm text-neutral-900 shadow-[2px_2px_0_0_rgba(0,0,0,0.06)] transition hover:shadow-[3px_3px_0_0_rgba(0,0,0,0.1)]"
            >
              <MailIcon className="h-4 w-4 shrink-0 text-neutral-600" />
              <span className="min-w-0 break-all leading-snug">{email}</span>
            </a>
          )}
          {phone && (
            <a
              href={telHref(phone)}
              className="inline-flex items-center gap-2.5 border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-800 transition hover:border-neutral-500"
            >
              <PhoneIcon className="h-4 w-4 text-neutral-500" />
              {phone}
            </a>
          )}
        </div>
        {address && (
          <p className="mt-12 inline-flex max-w-sm items-start gap-2.5 text-left text-sm text-neutral-600 md:mt-16">
            <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
            {address}
          </p>
        )}
        <p className="mt-8 text-center text-xs text-neutral-500 md:mt-10">
          {t('responseTime')}
        </p>
      </div>
    </section>
  )
}
