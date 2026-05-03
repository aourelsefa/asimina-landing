import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { categories } from '@/data/categories'

/** Cover art per category — one image from each `public/<folder>`. */
const serviceCoverById: Record<string, string> = {
  wedding: '/wedding/ASI_4389-2.jpg',
  'couples-family': '/Couples/DIO_6894.jpg',
  baptism: '/vaptism/vaptisi-kerkyrak-12.jpg',
  'fashion-portraits': '/fashion/DIO_2673.jpg',
  events: '/events/ASI_6094.jpg',
  advertisment: '/advertisment/DIO_4400.jpg',
}

export default function Categories() {
  const t = useTranslations('categories')
  const categoryT = useTranslations('categories.items')

  return (
    <section
      id="categories"
      className="bg-[#f5f5f5] py-20 text-gray-900 md:py-28"
      aria-labelledby="categories-heading"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">{t('eyebrow')}</span>
          <h2 id="categories-heading" className="mt-2 font-serif text-4xl font-bold text-gray-900 md:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-3 text-gray-600">{t('description')}</p>
        </div>
      </div>

      <div className="border-y border-gray-200/80 bg-[#f5f5f5] py-8">
        <div className="mx-auto grid max-w-[1800px] grid-cols-2 gap-2.5 px-3 pb-8 pt-2 sm:gap-4 md:grid-cols-3 md:px-6 lg:grid-cols-6 lg:gap-2 lg:px-6 xl:gap-3 xl:px-8 2xl:gap-4">
          {categories.map((cat) => {
            const src = serviceCoverById[cat.id] ?? serviceCoverById.wedding
            const name = categoryT(`${cat.id}.name`)
            const shortDescription = categoryT(`${cat.id}.shortDescription`)
            return (
              <Link
                key={cat.id}
                href={`/${cat.slug}`}
                className="group relative min-w-0 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition hover:border-gray-400 hover:shadow-lg sm:rounded-xl"
              >
                <article className="relative">
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={src}
                      alt={t('card.imageAlt', { name })}
                      fill
                      className="object-cover opacity-90 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-4 lg:p-3 xl:p-4 2xl:p-5">
                    <h3 className="font-serif text-base font-bold leading-tight text-white drop-shadow-sm sm:text-lg lg:text-sm xl:text-base 2xl:text-lg">
                      {name}
                    </h3>
                    <p className="mt-0.5 line-clamp-2 text-[0.65rem] leading-snug text-white/75 sm:mt-1 sm:text-xs lg:line-clamp-3 lg:text-[0.6rem] xl:text-xs">
                      {shortDescription}
                    </p>
                    <span className="mt-1.5 inline-flex items-center gap-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-white/90 sm:mt-2 sm:gap-1 sm:text-[11px] transition group-hover:text-amber-200/95">
                      <span className="md:hidden">{t('card.viewMobile')}</span>
                      <span className="hidden md:inline">{t('card.viewDesktop')}</span>
                      <svg
                        className="h-3 w-3 shrink-0 transition group-hover:translate-x-0.5 sm:h-3.5 sm:w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
