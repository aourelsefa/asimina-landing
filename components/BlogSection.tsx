import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { blogPosts } from '@/data/blogPosts'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function BlogSection() {
  const t = useTranslations('blog.section')
  const postT = useTranslations('blog.posts')

  return (
    <section
      id="blog"
      className="bg-[#f0efec] border-t border-gray-200/80 py-20 text-gray-900 md:py-28"
      aria-labelledby="blog-section-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">{t('eyebrow')}</span>
          <h2 id="blog-section-heading" className="mt-2 font-serif text-4xl font-bold text-gray-900 md:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-3 text-gray-600">{t('description')}</p>
        </div>

        <ul className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
          {blogPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-sm transition hover:border-gray-300 hover:shadow-md"
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden">
                  <Image
                    src={post.coverImage.src}
                    alt={postT(`${post.slug}.coverAlt`)}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <time
                    className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gray-400"
                    dateTime={post.publishedAt}
                  >
                    {formatDate(post.publishedAt)} · {t('minRead', { minutes: post.readTimeMinutes })}
                  </time>
                  <h3 className="mt-2 font-serif text-lg font-bold leading-snug text-gray-900 group-hover:underline group-hover:decoration-gray-400 group-hover:underline-offset-2 md:text-xl">
                    {postT(`${post.slug}.title`)}
                  </h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">{postT(`${post.slug}.excerpt`)}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-800">
                    {t('readArticle')}
                    <span aria-hidden className="transition group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
