import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Categories from '@/components/Categories'
import ScrollingGallery from '@/components/ScrollingGallery'
import Contact from '@/components/Contact'
import BlogSection from '@/components/BlogSection'
import { getTranslations } from 'next-intl/server'
import { mockAbout, mockGallery, mockContact, mockHero, socialInstagramUrl } from '@/data/mockData'
import { coerceLocale } from '@/lib/locale'
import { getSiteUrl } from '@/lib/site'
import { localeAlternates, localizedPath } from '@/lib/seo'

type HomeProps = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: HomeProps): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = coerceLocale(raw)
  const messages = (await import(`../../messages/${locale}.json`)).default as {
    site: { title: string; description: string; keywords?: string }
  }
  const { title, description, keywords: keywordsRaw } = messages.site
  const keywords =
    typeof keywordsRaw === 'string'
      ? keywordsRaw
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean)
      : []

  return {
    title: {
      absolute: title,
    },
    description,
    ...(keywords.length ? { keywords } : {}),
    alternates: localeAlternates(locale, []),
    openGraph: {
      title,
      description,
      url: localizedPath(locale, []),
      type: 'website',
    },
  }
}

export default async function Home({ params }: HomeProps) {
  const { locale: raw } = await params
  const locale = coerceLocale(raw)
  const heroT = await getTranslations('heroContent')
  const aboutT = await getTranslations('about')
  const contactT = await getTranslations('contact')
  const homeT = await getTranslations('home.gallerySection')
  const messages = (await import(`../../messages/${locale}.json`)).default as { site: { title: string } }
  const siteTitle = messages.site.title
  const baseUrl = getSiteUrl()

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        name: siteTitle,
        url: baseUrl,
        description:
          locale === 'nb'
            ? 'Fotograf i Oslo: bryllup, par, familie, dåp, mote, arrangement og reklame.'
            : 'Oslo photographer for weddings, couples, families, baptism, fashion, events, and advertising.',
        inLanguage: locale === 'nb' ? 'nb-NO' : 'en-GB',
        publisher: { '@id': `${baseUrl}/#business` },
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${baseUrl}/#business`,
        name: siteTitle,
        url: `${baseUrl}${localizedPath(locale, [])}`,
        image: `${baseUrl}/asimina-habipi-photographer-in-oslo.jpg`,
        logo: `${baseUrl}/asimina-habipi-logo.png`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Oslo',
          addressCountry: 'NO',
        },
        areaServed: { '@type': 'City', name: 'Oslo' },
        sameAs: [socialInstagramUrl],
      },
      {
        '@type': 'Person',
        '@id': `${baseUrl}/#person`,
        name: 'Asimina Habipi',
        url: `${baseUrl}${localizedPath(locale, [])}`,
        image: `${baseUrl}/asimina-habipi-photographer-in-oslo.jpg`,
        jobTitle: 'Photographer',
        worksFor: { '@id': `${baseUrl}/#business` },
        sameAs: [socialInstagramUrl],
      },
    ],
  }

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Hero
        title={heroT('title')}
        subtitle={heroT('subtitleHtml')}
        backgroundImage={{
          ...mockHero.backgroundImage,
          alt_text: heroT('imageAlt'),
        }}
      />
      <About
        title={aboutT('title')}
        description={aboutT.raw('descriptionHtml')}
        profileImage={{
          ...mockAbout.profileImage,
          alt_text: aboutT('imageAlt'),
        }}
      />
      <Categories />
      <section
        id="gallery"
        className="bg-[#1a1a1a] px-4 py-32"
        aria-labelledby="home-gallery-heading"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <span className="text-sm text-white/70 uppercase tracking-widest font-medium mb-4 block">{homeT('eyebrow')}</span>
            <h2
              id="home-gallery-heading"
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6"
            >
              {homeT('title')}
            </h2>
            <div className="w-24 h-px bg-white/30 mx-auto" />
          </div>
          <ScrollingGallery images={mockGallery} variant="minimal" />
        </div>
      </section>
      <Contact
        title={contactT('title')}
        lead={contactT('lead')}
        email={mockContact.email}
        phone={mockContact.phone}
        address={mockContact.address}
      />
      <BlogSection />
    </main>
  )
}

