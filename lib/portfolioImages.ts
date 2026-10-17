import type { WordPressImage } from '@/types/wordpress'
import type { CategoryId } from '@/data/categories'
import {
  buildFolderImageAlt,
  mockGallery,
  mockGalleryByCategory,
  serviceImageAltTopic,
} from '@/data/mockData'
import { client } from '@/sanity/lib/client'
import { CATEGORY_ALBUM_QUERY, GALLERY_ALBUM_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'

const GALLERY_ALT_TOPIC = 'Gallery'

type SanityPortfolioImageRow = {
  _key: string
  alt?: string | null
  image?: {
    asset?: {
      _id: string
      url?: string
      originalFilename?: string
      metadata?: { dimensions?: { width?: number; height?: number } }
    }
  }
}

function stableImageId(assetId: string, index: number): number {
  const digits = assetId.replace(/\D/g, '')
  const fromAsset = digits ? Number.parseInt(digits.slice(-8), 10) : 0
  return (fromAsset || 100_000) + index
}

function mapSanityRowsToWordPressImages(
  rows: SanityPortfolioImageRow[] | null | undefined,
  altTopic: string,
  idOffset: number
): WordPressImage[] {
  if (!rows?.length) return []

  return rows
    .filter((row) => row.image?.asset?.url)
    .map((row, index) => {
      const asset = row.image!.asset!
      const filename = asset.originalFilename ?? `image-${index + 1}.jpg`
      const dims = asset.metadata?.dimensions
      const sourceUrl = urlFor(row.image!).width(2000).quality(85).url()

      return {
        id: idOffset + stableImageId(asset._id, index),
        source_url: sourceUrl,
        alt_text: row.alt?.trim() || buildFolderImageAlt(altTopic, filename),
        media_details: {
          width: dims?.width ?? 1600,
          height: dims?.height ?? 1200,
        },
      }
    })
}

async function fetchSanityGalleryImages(): Promise<WordPressImage[] | null> {
  try {
    const rows = await client.fetch<SanityPortfolioImageRow[] | null>(
      GALLERY_ALBUM_QUERY,
      {},
      { next: { revalidate: 60, tags: ['galleryAlbum'] } }
    )
    const mapped = mapSanityRowsToWordPressImages(rows, GALLERY_ALT_TOPIC, 3)
    return mapped.length > 0 ? mapped : null
  } catch {
    return null
  }
}

async function fetchSanityCategoryImages(
  categoryId: CategoryId
): Promise<WordPressImage[] | null> {
  try {
    const rows = await client.fetch<SanityPortfolioImageRow[] | null>(
      CATEGORY_ALBUM_QUERY,
      { categoryId },
      { next: { revalidate: 60, tags: ['categoryAlbum', `categoryAlbum:${categoryId}`] } }
    )
    const topic = serviceImageAltTopic[categoryId]
    const idOffset =
      categoryId === 'wedding'
        ? 10_000
        : categoryId === 'couples-family'
          ? 20_000
          : categoryId === 'baptism'
            ? 25_000
            : categoryId === 'fashion-portraits'
              ? 30_000
              : categoryId === 'events'
                ? 50_000
                : 60_000
    const mapped = mapSanityRowsToWordPressImages(rows, topic, idOffset)
    return mapped.length > 0 ? mapped : null
  } catch {
    return null
  }
}

/** Main gallery page + home scrolling strip (Sanity with static fallback). */
export async function getGalleryImages(): Promise<WordPressImage[]> {
  const fromSanity = await fetchSanityGalleryImages()
  return fromSanity ?? mockGallery
}

/** Service category detail page albums (Sanity with static fallback). */
export async function getCategoryAlbumImages(
  categoryId: CategoryId
): Promise<WordPressImage[]> {
  const fromSanity = await fetchSanityCategoryImages(categoryId)
  return fromSanity ?? mockGalleryByCategory[categoryId]
}
