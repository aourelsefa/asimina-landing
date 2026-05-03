import Hero from '@/components/Hero'
import About from '@/components/About'
import Categories from '@/components/Categories'
import ScrollingGallery from '@/components/ScrollingGallery'
import Contact from '@/components/Contact'
import BlogSection from '@/components/BlogSection'
import { getTranslations } from 'next-intl/server'
import { mockAbout, mockGallery, mockContact, mockHero } from '@/data/mockData'

export default async function Home() {
  const heroT = await getTranslations('heroContent')
  const aboutT = await getTranslations('about')
  const contactT = await getTranslations('contact')
  const homeT = await getTranslations('home.gallerySection')

  return (
    <main className="min-h-screen">
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
      <section id="gallery" className="bg-[#1a1a1a] px-4 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <span className="text-sm text-white/70 uppercase tracking-widest font-medium mb-4 block">{homeT('eyebrow')}</span>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6">{homeT('title')}</h2>
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

