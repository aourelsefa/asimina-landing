'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { mockContact } from '@/data/mockData'
import LanguageSwitcher from '@/components/LanguageSwitcher'

/** Smooth-scroll anchor offset — keep in sync with nav bar height (logo + vertical padding). */
const NAV_ANCHOR_OFFSET_PX = 136

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

/** Hash links off the homepage go to `/#section` so the home layout loads with the right anchor. */
function navItemDestination(href: string) {
  if (href.startsWith('#')) return `/${href}`
  return href
}

function NavContactStrip({ shouldShowScrolled }: { shouldShowScrolled: boolean }) {
  const link = shouldShowScrolled
    ? 'text-gray-800 hover:text-gray-950 transition-colors'
    : 'text-white hover:text-white/95 transition-colors'
  const rule = shouldShowScrolled ? 'bg-gray-900/40' : 'bg-white/50'

  return (
    <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-[13px] font-medium tracking-wide">
      <a href={telHref(mockContact.phone)} className={link}>
        {mockContact.phone}
      </a>
      <span className={`inline-block h-3.5 w-px shrink-0 ${rule}`} aria-hidden />
      <a href={`mailto:${mockContact.email}`} className={`${link} lowercase tracking-normal`}>
        {mockContact.email}
      </a>
    </div>
  )
}

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('navigation')
  const siteT = useTranslations('site')
  const isHomePage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: '#about', label: t('items.about') },
    { href: '#categories', label: t('items.categories') },
    { href: '/gallery', label: t('items.gallery') },
    { href: '#blog', label: t('items.blog') },
    { href: '#contact', label: t('items.contact') },
  ]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    
    // If not on homepage, navigate to homepage first
    if (!isHomePage) {
      window.location.href = `/${locale}/${href}`
      return
    }
    
    const targetId = href.replace('#', '')
    const element = document.getElementById(targetId)
    
    if (element) {
      const offset = NAV_ANCHOR_OFFSET_PX
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    
    // Close mobile menu if open
    setIsMobileMenuOpen(false)
  }

  // On category pages, always show scrolled style
  const shouldShowScrolled = isScrolled || !isHomePage

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        shouldShowScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm py-4 md:py-5 min-h-[5.25rem] md:min-h-[5.75rem]'
          : 'bg-transparent py-5 md:py-6 min-h-[5.75rem] md:min-h-[6.25rem]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {isHomePage ? (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="relative block shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white rounded-sm"
            >
              <Image
                src="/asimina-habipi-logo.png"
                alt={siteT('title')}
                width={280}
                height={90}
                priority
                className={`w-auto object-contain object-left transition-all duration-300 ${
                  shouldShowScrolled
                    ? 'h-12 sm:h-14 md:h-[3.75rem]'
                    : 'h-14 sm:h-16 md:h-[4.25rem]'
                } ${!shouldShowScrolled ? 'invert drop-shadow-md' : ''}`}
              />
            </a>
          ) : (
            <Link
              href="/"
              className="relative block shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 rounded-sm"
            >
              <Image
                src="/asimina-habipi-logo.png"
                alt={siteT('title')}
                width={280}
                height={90}
                priority
                className="h-12 sm:h-14 md:h-[3.75rem] w-auto object-contain object-left transition-all duration-300"
              />
            </Link>
          )}

          {/* Desktop: contact row + rule + menu */}
          <div className="hidden md:flex min-w-0 flex-col items-end justify-center gap-2.5">
            <div className="flex w-full items-center justify-end gap-4">
              <LanguageSwitcher variant={shouldShowScrolled ? 'light' : 'dark'} />
              <NavContactStrip shouldShowScrolled={shouldShowScrolled} />
            </div>
            <div
              className={`flex w-full min-w-max items-center justify-end gap-10 border-t pt-3 lg:gap-12 ${
                shouldShowScrolled ? 'border-gray-200' : 'border-white/30'
              }`}
            >
              {navItems.map((item) => {
                const linkClass = `text-sm uppercase tracking-wider font-medium transition-all duration-300 relative group ${
                  shouldShowScrolled
                    ? 'text-gray-700 hover:text-gray-900'
                    : 'text-white hover:text-white'
                }`
                const underline = (
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-current transition-all duration-300 group-hover:w-full" />
                )
                if (!isHomePage) {
                  return (
                    <Link key={item.href} href={navItemDestination(item.href)} className={linkClass}>
                      {item.label}
                      {underline}
                    </Link>
                  )
                }
                if (item.href.startsWith('#')) {
                  return (
                    <a key={item.href} href={item.href} onClick={(e) => handleNavClick(e, item.href)} className={linkClass}>
                      {item.label}
                      {underline}
                    </a>
                  )
                }
                return (
                  <Link key={item.href} href={item.href} className={linkClass}>
                    {item.label}
                    {underline}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden transition-colors ${
              shouldShowScrolled ? 'text-gray-900' : 'text-white'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={t('mobile.toggleMenu')}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 space-y-6">
            <div className="flex justify-end">
              <LanguageSwitcher variant={shouldShowScrolled ? 'light' : 'dark'} />
            </div>
            <div
              className={`flex flex-col gap-3 rounded-sm border px-4 py-3 ${
                shouldShowScrolled
                  ? 'border-gray-200 bg-gray-50/80'
                  : 'border-white/25 bg-black/20 backdrop-blur-sm'
              }`}
            >
              <p
                className={`text-[10px] uppercase tracking-[0.2em] ${
                  shouldShowScrolled ? 'text-gray-500' : 'text-white/60'
                }`}
              >
                {t('mobile.reachOut')}
              </p>
              <div className="flex flex-col gap-2.5 text-sm">
                <a
                  href={telHref(mockContact.phone)}
                  className={
                    shouldShowScrolled
                      ? 'font-medium text-gray-900'
                      : 'font-medium text-white'
                  }
                >
                  {mockContact.phone}
                </a>
                <span
                  className={`h-px w-full ${shouldShowScrolled ? 'bg-gray-900/15' : 'bg-white/25'}`}
                  aria-hidden
                />
                <a
                  href={`mailto:${mockContact.email}`}
                  className={
                    shouldShowScrolled
                      ? 'text-gray-800 lowercase'
                      : 'text-white/95 lowercase'
                  }
                >
                  {mockContact.email}
                </a>
              </div>
            </div>
            {navItems.map((item) => {
              const mobileClass = `block text-sm uppercase tracking-wider font-medium transition-colors ${
                shouldShowScrolled ? 'text-gray-700' : 'text-white'
              }`
              if (!isHomePage) {
                return (
                  <Link
                    key={item.href}
                    href={navItemDestination(item.href)}
                    className={mobileClass}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              }
              if (item.href.startsWith('#')) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={mobileClass}
                    onClick={(e) => {
                      handleNavClick(e, item.href)
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    {item.label}
                  </a>
                )
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={mobileClass}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}
