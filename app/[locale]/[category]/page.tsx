'use client'

import { useCallback, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { categories } from '@/data/categories'
import { mockGalleryByCategory } from '@/data/mockData'
import { CategoryImageLightbox } from '@/components/CategoryImageLightbox'

export default function CategoryPage() {
  const params = useParams()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const t = useTranslations('categories')
  const commonT = useTranslations('common')
  const categoryT = useTranslations('categories.items')

  const categorySlug = params?.category as string
  if (!categorySlug) {
    notFound()
  }

  const category = categories.find((cat) => cat.slug === categorySlug)
  if (!category) {
    notFound()
  }

  const categoryIndex = categories.findIndex((c) => c.slug === category.slug)
  const chapterNo = String(categoryIndex + 1).padStart(2, '0')
  const categoryImages = mockGalleryByCategory[category.id]
  const name = categoryT(`${category.id}.name`)
  const pageTitle = categoryT(`${category.id}.pageTitle`)
  const shortDescription = categoryT(`${category.id}.shortDescription`)
  const fullDescriptionHtml = categoryT.raw(`${category.id}.fullDescriptionHtml`)

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  function openLightboxAt(galleryIndex: number) {
    window.setTimeout(() => setLightboxIndex(galleryIndex), 0)
  }

  return (
    <>
      <main className="min-h-screen bg-[#f0efec] text-gray-900">
        <header className="relative overflow-hidden border-b border-black/10 bg-[#141414] px-4 pb-16 pt-28 text-white md:pb-20 md:pt-32">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 font-serif text-[clamp(5rem,18vw,14rem)] font-bold leading-none tracking-tighter text-white/[0.04]"
            aria-hidden
          >
            {name.slice(0, 1)}
          </div>

          <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-14 lg:gap-20">
              <div className="flex shrink-0 items-start gap-4 md:flex-col md:items-center md:pt-1">
                <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/35">{commonT('numberLabel')}</span>
                <span className="font-serif text-4xl font-light tabular-nums leading-none text-amber-200/35 md:text-6xl">
                  {chapterNo}
                </span>
                <div className="hidden h-32 w-px bg-gradient-to-b from-amber-400/40 to-transparent md:block" aria-hidden />
              </div>

              <div className="min-w-0 max-w-3xl border-l border-white/10 pl-6 md:pl-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-200/80">{t('eyebrow')}</p>
                <h1 className="mt-3 font-serif text-[clamp(1.85rem,4.2vw,3.25rem)] font-semibold leading-[1.08] tracking-tight">
                  {pageTitle}
                </h1>
                <div className="mt-6 flex items-center gap-3">
                  <span className="h-px w-12 bg-amber-400/50" />
                  <span className="h-px flex-1 max-w-[200px] bg-white/15" />
                </div>
                <p className="mt-6 text-base leading-relaxed text-white/60 md:text-lg">{shortDescription}</p>
              </div>
            </div>
          </div>
        </header>

        <section className="border-b border-gray-200/90 bg-white">
          <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 md:py-20">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gray-400">{t('approachLabel')}</p>
            <div
              className="prose prose-lg mt-5 max-w-3xl text-left text-base leading-relaxed text-gray-600 prose-p:mb-5 prose-p:last:mb-0 md:text-lg"
              dangerouslySetInnerHTML={{ __html: fullDescriptionHtml }}
            />
          </div>
        </section>

        <section className="border-b border-gray-200 bg-[#1a1a1a]">
          <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 md:py-16">
            <div className="mb-8 max-w-3xl text-left md:mb-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40">{t('portfolioLabel')}</p>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-white md:text-3xl">{t('selectedWorkTitle')}</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/45">
                {t('selectedWorkLead', { name })}
              </p>
            </div>

            {categoryImages.length > 0 ? (
              <div className="columns-3 gap-x-2 sm:columns-4 sm:gap-x-2.5 md:columns-5 md:gap-x-3 lg:columns-6 xl:columns-7">
                {categoryImages.map((image, index) => {
                  const w = image.media_details?.width ?? 640
                  const h = image.media_details?.height ?? 800
                  return (
                    <figure key={`${image.id}-${index}`} className="mb-2.5 break-inside-avoid sm:mb-3">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          openLightboxAt(index)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            openLightboxAt(index)
                          }
                        }}
                        className="group relative block w-full cursor-pointer overflow-hidden rounded-md border border-white/[0.08] bg-black/40 text-left shadow-sm outline-none ring-offset-2 ring-offset-[#1a1a1a] transition hover:border-white/20 hover:shadow-md focus-visible:ring-2 focus-visible:ring-amber-400/50"
                      >
                        <Image
                          src={image.source_url}
                          alt={
                            image.alt_text ||
                            t('gridImageAlt', { pageTitle, index: index + 1 })
                          }
                          width={w}
                          height={h}
                          className="pointer-events-none h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 14vw"
                          loading="lazy"
                        />
                        <span className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                      </div>
                    </figure>
                  )
                })}
              </div>
            ) : (
              <p className="py-12 text-left text-sm text-white/45">{t('imagesComingSoon')}</p>
            )}
          </div>
        </section>

        <section className="bg-[#f0efec]">
          <div className="mx-auto w-full max-w-6xl border-t border-gray-300/60 px-4 py-14 sm:px-6 md:py-16">
            <div className="max-w-2xl text-left">
              <h2 className="font-serif text-2xl font-bold text-gray-900 md:text-3xl">{t('cta.title')}</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">
                {t('cta.lead', { name: name.toLowerCase() })}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/#contact"
                  className="inline-flex w-fit min-w-[180px] items-center justify-center border border-gray-900 bg-gray-900 px-6 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-white transition hover:bg-gray-800"
                >
                  {t('cta.getInTouch')}
                </Link>
                <Link
                  href="/#categories"
                  className="inline-flex w-fit min-w-[180px] items-center justify-center border border-gray-400 bg-white px-6 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-800 transition hover:border-gray-900"
                >
                  {t('cta.allServices')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {lightboxIndex !== null && categoryImages.length > 0 ? (
        <CategoryImageLightbox
          images={categoryImages}
          index={Math.min(lightboxIndex, categoryImages.length - 1)}
          onIndexChange={setLightboxIndex}
          onClose={closeLightbox}
        />
      ) : null}
    </>
  )
}

