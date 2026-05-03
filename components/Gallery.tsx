'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { WordPressImage } from '@/types/wordpress'

interface GalleryProps {
  images: WordPressImage[]
}

export default function Gallery({ images }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<WordPressImage | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const t = useTranslations('galleryComponent')

  if (!images || images.length === 0) {
    return (
      <section id="gallery" className="py-32 px-4 bg-black text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6">{t('title')}</h2>
          <p className="text-gray-400 text-lg">
            {t('empty')}
          </p>
        </div>
      </section>
    )
  }

  // Create a masonry-style layout with varying heights
  const getImageHeight = (index: number) => {
    const heights = ['h-64', 'h-80', 'h-96', 'h-72', 'h-64', 'h-80', 'h-96', 'h-72', 'h-80', 'h-64']
    return heights[index % heights.length]
  }

  const handleImageClick = (image: WordPressImage) => {
    setSelectedImage(image)
  }

  const handleCloseModal = () => {
    setSelectedImage(null)
  }

  return (
    <>
      <section id="gallery" className="py-32 px-4 bg-black text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <span className="text-sm text-white/70 uppercase tracking-widest font-medium mb-4 block">
              {t('eyebrow')}
            </span>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
              {t('title')}
            </h2>
            <div className="w-24 h-px bg-white/30 mx-auto" />
          </div>
          
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`relative overflow-hidden group cursor-pointer break-inside-avoid mb-4 ${getImageHeight(index)}`}
                onClick={() => handleImageClick(image)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={image.source_url}
                    alt={image.alt_text || t('imageAlt', { index: image.id })}
                    fill
                    className={`object-cover transition-all duration-700 ${
                      hoveredIndex === index ? 'scale-110 brightness-110' : 'scale-100'
                    }`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className={`absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/0 to-black/0 transition-opacity duration-500 ${
                    hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                  }`} />
                  
                  {/* Image number */}
                  <div className={`absolute bottom-4 left-4 z-[2] text-white text-sm font-normal transition-opacity duration-500 ${
                    hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                  }`}>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease-in]"
          onClick={handleCloseModal}
        >
          <button
            className="absolute top-6 right-6 text-white text-5xl hover:text-gray-300 transition-colors z-[101] font-light w-12 h-12 flex items-center justify-center bg-black/50 rounded-full"
            onClick={handleCloseModal}
            aria-label={t('close')}
          >
            ×
          </button>
          
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={selectedImage.source_url}
              alt={selectedImage.alt_text || t('selectedAlt')}
              className="max-h-[90vh] max-w-full w-auto object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          {/* Navigation hint */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-sm pointer-events-none">
            {t('clickOutside')}
          </div>
        </div>
      )}
    </>
  )
}
