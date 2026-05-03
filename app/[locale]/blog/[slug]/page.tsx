import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { blogPosts, getPostBySlug, getAllSlugs } from '@/data/blogPosts'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) {
    return { title: 'Not found' }
  }

  const siteT = await getTranslations('site')
  const postsT = await getTranslations('blog.posts')
  const title = postsT(`${post.slug}.title`)
  const metaDescription = postsT(`${post.slug}.metaDescription`)
  const coverAlt = postsT(`${post.slug}.coverAlt`)
  const keywords = postsT(`${post.slug}.keywords`).split('|').map((k) => k.trim()).filter(Boolean)

  return {
    title: `${title} | ${siteT('title')}`,
    description: metaDescription,
    keywords,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title,
      description: metaDescription,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [{ url: post.coverImage.src, alt: coverAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: metaDescription,
    },
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) {
    notFound()
  }

  const postsT = await getTranslations('blog.posts')
  const t = await getTranslations('blog.post')
  const sectionT = await getTranslations('blog.section')
  const commonT = await getTranslations('common')
  const title = postsT(`${post.slug}.title`)
  const excerpt = postsT(`${post.slug}.excerpt`)
  const bodyHtml = postsT.raw(`${post.slug}.bodyHtml`)
  const coverAlt = postsT(`${post.slug}.coverAlt`)

  const chapterIndex = blogPosts.findIndex((p) => p.slug === post.slug)
  const chapterNo = String(chapterIndex + 1).padStart(2, '0')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: postsT(`${post.slug}.metaDescription`),
    image: post.coverImage.src,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: 'Asimina Habipi',
    },
    publisher: {
      '@type': 'Organization',
      name: (await getTranslations('site'))('title'),
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `/blog/${post.slug}`,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

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
            B
          </div>

          <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-amber-200/80">{t('journal')}</p>
            <div className="mt-2">
              <Link href="/#blog" className="text-sm text-white/50 transition hover:text-white/90">
                {t('backToBlog')}
              </Link>
            </div>
            <div className="mt-10 flex flex-col gap-10 md:mt-12 md:flex-row md:items-start md:gap-14 lg:gap-20">
              <div className="flex shrink-0 items-start gap-4 md:flex-col md:items-center md:pt-1">
                <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/35">{commonT('numberLabel')}</span>
                <span className="font-serif text-4xl font-light tabular-nums leading-none text-amber-200/35 md:text-6xl">
                  {chapterNo}
                </span>
                <div className="hidden h-32 w-px bg-gradient-to-b from-amber-400/40 to-transparent md:block" aria-hidden />
              </div>

              <div className="min-w-0 max-w-3xl border-l border-white/10 pl-6 md:pl-10">
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-amber-200/80">{t('category')}</p>
                <h1 className="mt-3 font-serif text-[clamp(1.75rem,3.8vw,2.75rem)] font-semibold leading-[1.12] tracking-tight text-balance">
                  {title}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/55">
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  <span aria-hidden className="text-white/25">
                    ·
                  </span>
                  <span>{sectionT('minRead', { minutes: post.readTimeMinutes })}</span>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <span className="h-px w-12 bg-amber-400/50" />
                  <span className="h-px max-w-[200px] flex-1 bg-white/15" />
                </div>
                <p className="mt-6 text-base leading-relaxed text-white/60 md:text-lg text-pretty">{excerpt}</p>
              </div>
            </div>
          </div>
        </header>

        <section className="border-b border-gray-200/90 bg-white">
          <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:py-14">
            <div className="relative -mt-4 mb-10 max-w-4xl overflow-hidden rounded-lg border border-gray-200/80 bg-gray-100 shadow-sm md:mb-14">
              <div className="relative aspect-[2/1] w-full sm:aspect-[2.2/1]">
                <Image
                  src={post.coverImage.src}
                  alt={coverAlt}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1200px) 100vw, 1152px"
                />
              </div>
            </div>
            <div
              className="prose prose-lg max-w-3xl text-left text-base leading-relaxed text-gray-600 prose-headings:font-serif prose-h2:mt-10 prose-h2:text-gray-900 prose-p:mb-5 prose-p:last:mb-0 md:text-lg"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          </div>
        </section>

        <section className="bg-[#f0efec]">
          <div className="mx-auto w-full max-w-6xl border-t border-gray-300/60 px-4 py-14 sm:px-6 md:py-16">
            <div className="max-w-2xl text-left">
              <h2 className="font-serif text-2xl font-bold text-gray-900 md:text-3xl">{t('planningTitle')}</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">{t('planningLead')}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/#contact"
                  className="inline-flex w-fit min-w-[180px] items-center justify-center border border-gray-900 bg-gray-900 px-6 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-white transition hover:bg-gray-800"
                >
                  {t('getInTouch')}
                </Link>
                <Link
                  href="/#blog"
                  className="inline-flex w-fit min-w-[180px] items-center justify-center border border-gray-400 bg-white px-6 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-800 transition hover:border-gray-900"
                >
                  {t('moreArticles')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

