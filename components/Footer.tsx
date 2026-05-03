'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { categories } from '@/data/categories'
import { mockContact, socialInstagramUrl } from '@/data/mockData'

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const siteT = useTranslations('site')
  const t = useTranslations('footer')
  const nav = useTranslations('navigation.items')
  const categoryT = useTranslations('categories.items')
  
  return (
    <footer className="bg-[#0f0f0f] text-white py-24 px-4 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-5 flex flex-col">
            <div className="mb-8 max-w-[min(100%,420px)] md:mb-10">
              <Link
                href="/"
                className="inline-block w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60 rounded-sm"
              >
                <Image
                  src="/LogoNegative.png"
                  alt={siteT('title')}
                  width={420}
                  height={137}
                  className="h-auto w-full"
                />
              </Link>
              <p className="mt-3 max-w-sm text-xs leading-relaxed tracking-wide text-white/50">
                {t('tagline')}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a
                href={socialInstagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                aria-label={t('social.instagram')}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                aria-label={t('social.facebook')}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/kristiana-habipi-11466b320?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                aria-label={t('social.linkedin')}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-2">
            <p className="text-white text-sm uppercase tracking-widest font-medium mb-6">
              {t('quickLinks.title')}
            </p>
            <ul className="space-y-3">
              <li>
                <Link href="/#about" className="text-white/70 hover:text-white transition-colors">
                  {nav('about')}
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="text-white/70 hover:text-white transition-colors">
                  {nav('categories')}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-white/70 hover:text-white transition-colors">
                  {nav('gallery')}
                </Link>
              </li>
              <li>
                <Link href="/#blog" className="text-white/70 hover:text-white transition-colors">
                  {nav('blog')}
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-white/70 hover:text-white transition-colors">
                  {nav('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-2">
            <p className="text-white text-sm uppercase tracking-widest font-medium mb-6">
              {t('categories.title')}
            </p>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/${cat.slug}`} className="text-white/70 hover:text-white transition-colors">
                    {categoryT(`${cat.id}.name` as never)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <p className="text-white text-sm uppercase tracking-widest font-medium mb-6">
              {t('contact.title')}
            </p>
            <div className="space-y-4 text-white/70">
              <p className="leading-relaxed">
                {t('contact.location')}
              </p>
              <p className="leading-relaxed">
                <a href={`mailto:${mockContact.email}`} className="hover:text-white transition-colors">
                  {mockContact.email}
                </a>
              </p>
              <p className="leading-relaxed">
                <a href={telHref(mockContact.phone)} className="hover:text-white transition-colors">
                  {mockContact.phone}
                </a>
              </p>
              <div className="pt-2">
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  {t('contact.sendMessage')}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-gray-300 text-sm font-normal">
              {t('copyright', { year: currentYear })}
            </p>
            <p className="text-gray-400 text-xs mt-1 font-normal">
              {t('rightsReserved')}
            </p>
            <p className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-gray-500 md:justify-start">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                {t('privacyPolicy')}
              </Link>
              <span className="text-gray-600" aria-hidden>
                ·
              </span>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                {t('cookiePolicy')}
              </Link>
            </p>
          </div>

          <div className="text-center md:text-right">
            <p className="text-gray-400 text-xs font-normal">
              {t.rich('developedWith', {
                heart: (chunks) => <span className="text-red-500">{chunks}</span>,
                agency: (chunks) => (
                  <a
                    href="https://sefaweb.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
