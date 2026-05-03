'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'

type AboutPolaroidLayoutProps = {
  title: string
  description: string
  imageSrc: string | null
  imageAlt: string
  /** e.g. `about` for in-page #about navigation; omit on demo pages. */
  sectionId?: string
}

const sectionBackground: CSSProperties = {
  backgroundColor: '#e8e4dc',
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c4bdb0' fill-opacity='0.25'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
}

/**
 * About section — polaroid image left, text right (home page).
 */
export default function AboutPolaroidLayout({
  title,
  description,
  imageSrc,
  imageAlt,
  sectionId,
}: AboutPolaroidLayoutProps) {
  const descriptionWithBr = description.replace(/<\/p>/gi, '</p><br />')

  return (
    <section id={sectionId} className="relative py-24 md:py-32" style={sectionBackground}>
      <div className="mx-auto max-w-5xl px-4">
        {imageSrc ? (
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-center md:gap-12 lg:gap-14">
            <div className="mx-auto w-full max-w-md shrink-0 sm:mx-0 sm:max-w-none sm:w-auto">
              <div className="-rotate-1 transform rounded border border-stone-300/60 bg-white p-3 pb-6 shadow-2xl shadow-stone-900/20 sm:pb-8">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-200 sm:w-80">
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 96vw, 320px"
                  />
                </div>
                <h2 className="mt-3 text-center font-serif text-base italic text-stone-800 sm:mt-4 sm:text-lg">
                  {title}
                </h2>
              </div>
            </div>
            <div className="w-full min-w-0 max-w-xl flex-1 rounded-lg border border-stone-300/80 bg-white p-6 shadow-md shadow-stone-900/5 md:max-w-none md:py-8 md:pl-2 md:pr-0">
              <div
                className="prose max-w-none text-[15px] leading-relaxed [&_p]:mb-0 [&_p]:mt-0 [&_p]:text-stone-900 md:prose-p:text-[17px]"
                dangerouslySetInnerHTML={{ __html: descriptionWithBr }}
              />
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl">
            <div className="rounded-lg border border-stone-300/80 bg-white p-6 shadow-md shadow-stone-900/5 md:p-8">
              <h2 className="mb-6 text-center font-serif text-2xl font-bold text-stone-900 md:text-3xl">{title}</h2>
              <div
                className="prose max-w-none text-[15px] leading-relaxed [&_p]:mb-0 [&_p]:mt-0 [&_p]:text-stone-900 md:prose-p:text-[17px]"
                dangerouslySetInnerHTML={{ __html: descriptionWithBr }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
