import type { MetadataRoute } from 'next'
import { blogSlugs } from '@/data/blogPosts'
import { categoryIds } from '@/data/categories'
import { locales } from '@/i18n/routing'
import { getSiteUrl } from '@/lib/site'
import { localizedPath } from '@/lib/seo'

const staticSegments: (string | undefined)[] = [undefined, 'gallery', 'privacy', 'cookies']

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl()
  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const seg of staticSegments) {
      const path = localizedPath(locale, seg ? [seg] : [])
      entries.push({
        url: `${base}${path}`,
        lastModified: new Date(),
        changeFrequency: seg === undefined ? 'weekly' : 'monthly',
        priority: seg === undefined ? 1 : seg === 'gallery' ? 0.9 : 0.7,
      })
    }

    for (const cat of categoryIds) {
      entries.push({
        url: `${base}${localizedPath(locale, [cat])}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.75,
      })
    }

    for (const slug of blogSlugs) {
      entries.push({
        url: `${base}${localizedPath(locale, ['blog', slug])}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.65,
      })
    }
  }

  return entries
}
