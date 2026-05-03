'use client'

import { useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import type { WordPressImage } from '@/types/wordpress'

type Props = {
  images: WordPressImage[]
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
    </svg>
  )
}

export function CategoryImageLightbox({ images, index, onIndexChange, onClose }: Props) {
  const t = useTranslations('lightbox')
  const image = images[index]
  const canPrev = index > 0
  const canNext = index < images.length - 1

  const goPrev = useCallback(() => {
    if (canPrev) onIndexChange(index - 1)
  }, [canPrev, index, onIndexChange])

  const goNext = useCallback(() => {
    if (canNext) onIndexChange(index + 1)
  }, [canNext, index, onIndexChange])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose, goPrev, goNext])

  if (!image) return null

  return (
    <div className="fixed inset-0 z-[200]" role="dialog" aria-modal="true" aria-label={t('viewerLabel')}>
      <button
        type="button"
        className="absolute inset-0 z-0 bg-black/92 backdrop-blur-sm"
        aria-label={t('close')}
        onClick={onClose}
      />

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-14 sm:p-16 md:p-20">
        <div
          className="pointer-events-auto relative flex max-h-full max-w-full items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={image.source_url}
            alt={image.alt_text || t('imageAlt')}
            className="max-h-[min(88vh,1200px)] max-w-[min(100vw-7rem,1400px)] object-contain select-none"
            draggable={false}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        className="pointer-events-auto absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-5 sm:top-5 sm:h-12 sm:w-12"
        aria-label={t('close')}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      {canPrev ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            goPrev()
          }}
          className="pointer-events-auto absolute left-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-4 sm:h-14 sm:w-14"
          aria-label={t('previous')}
        >
          <ChevronLeft className="h-7 w-7 sm:h-8 sm:w-8" />
        </button>
      ) : null}

      {canNext ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            goNext()
          }}
          className="pointer-events-auto absolute right-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-4 sm:h-14 sm:w-14"
          aria-label={t('next')}
        >
          <ChevronRight className="h-7 w-7 sm:h-8 sm:w-8" />
        </button>
      ) : null}
    </div>
  )
}
