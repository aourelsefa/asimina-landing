'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { WordPressImage } from '@/types/wordpress'

interface ScrollingGalleryProps {
  images: WordPressImage[]
  variant?: 'default' | 'minimal' | 'elegant'
}

/** Pick `count` frames spread across the full gallery so the strip reflects the whole set, not only the first names alphabetically. */
function pickStripImages(images: WordPressImage[], count: number): WordPressImage[] {
  const n = images.length
  if (n === 0) return []
  if (n <= count) return [...images]
  const picks: WordPressImage[] = []
  const segments = count - 1
  for (let i = 0; i < count; i++) {
    const idx = segments === 0 ? 0 : Math.round((i * (n - 1)) / segments)
    picks.push(images[idx])
  }
  return picks
}

export default function ScrollingGallery({ images, variant = 'default' }: ScrollingGalleryProps) {
  const [isHovered, setIsHovered] = useState(false)
  const t = useTranslations('scrollingGallery')

  // Ten thumbnails sampled evenly across the same list as /gallery (not only slice(0, 10)).
  const limitedImages = pickStripImages(images, 10)
  // Duplicate 3 times to ensure smooth infinite scroll
  const duplicatedImages = [...limitedImages, ...limitedImages, ...limitedImages]

  // Split images into 3 columns
  const leftImages = duplicatedImages.filter((_, i) => i % 3 === 0)
  const middleImages = duplicatedImages.filter((_, i) => i % 3 === 1)
  const rightImages = duplicatedImages.filter((_, i) => i % 3 === 2)

  // Variant styles
  const variantStyles = {
    default: {
      container: 'bg-black',
      overlay: 'bg-black/70',
      text: 'text-white',
      border: 'border-white/20',
    },
    minimal: {
      container: 'bg-[#1a1a1a]',
      overlay: 'bg-[#1a1a1a]/85',
      text: 'text-white',
      border: 'border-white/15',
    },
    elegant: {
      container: 'bg-gradient-to-br from-gray-900 via-black to-gray-900',
      overlay: 'bg-gradient-to-br from-black/80 to-gray-900/80',
      text: 'text-white',
      border: 'border-white/10',
    },
  }

  const styles = variantStyles[variant]

  return (
    <div 
      className={`relative w-full h-[600px] overflow-hidden group rounded-lg ${styles.container} ${styles.border} border`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Three Columns Container */}
      <div className="absolute inset-0 flex gap-2 md:gap-4 p-2 md:p-4">
        {/* Left Column - Scrolls Down */}
        <div className="flex-1 relative overflow-hidden">
          <div 
            className={`absolute inset-0 flex flex-col gap-2 md:gap-4 transition-all duration-500 ${
              isHovered ? 'animate-scroll-down-paused' : 'animate-scroll-down'
            }`}
          >
            {leftImages.map((image, index) => (
              <div
                key={`left-${image.id}-${index}`}
                className="relative w-full h-48 flex-shrink-0 rounded overflow-hidden"
              >
                <Image
                  src={image.source_url}
                  alt={image.alt_text || t('imageAlt', { index: index + 1 })}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column - Scrolls Up */}
        <div className="flex-1 relative overflow-hidden">
          <div 
            className={`absolute inset-0 flex flex-col gap-2 md:gap-4 transition-all duration-500 ${
              isHovered ? 'animate-scroll-up-paused' : 'animate-scroll-up'
            }`}
          >
            {middleImages.map((image, index) => (
              <div
                key={`middle-${image.id}-${index}`}
                className="relative w-full h-48 flex-shrink-0 rounded overflow-hidden"
              >
                <Image
                  src={image.source_url}
                  alt={image.alt_text || t('imageAlt', { index: index + 1 })}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Scrolls Down */}
        <div className="flex-1 relative overflow-hidden">
          <div 
            className={`absolute inset-0 flex flex-col gap-2 md:gap-4 transition-all duration-500 ${
              isHovered ? 'animate-scroll-down-paused' : 'animate-scroll-down'
            }`}
          >
            {rightImages.map((image, index) => (
              <div
                key={`right-${image.id}-${index}`}
                className="relative w-full h-48 flex-shrink-0 rounded overflow-hidden"
              >
                <Image
                  src={image.source_url}
                  alt={image.alt_text || t('imageAlt', { index: index + 1 })}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Single Overlay for All Columns */}
      <div className={`absolute inset-0 ${styles.overlay} flex items-center justify-center transition-opacity duration-500 z-10 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="text-center px-4">
          <h3 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${styles.text}`}>
            <Link
              href="/gallery"
              className="rounded-sm underline-offset-[6px] transition hover:underline hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
            >
              {t('overlay.title')}
            </Link>
          </h3>
          <p className={`${styles.text} text-lg md:text-xl font-medium uppercase tracking-wider opacity-90`}>
            {t('overlay.lead')}
          </p>
        </div>
      </div>
    </div>
  )
}
