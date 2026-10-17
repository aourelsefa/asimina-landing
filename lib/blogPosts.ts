import type { AppLocale } from '@/i18n/routing'
import { blogPosts as staticPosts, getAllSlugs as getStaticSlugs, getPostBySlug as getStaticPostBySlug } from '@/data/blogPosts'
import { liveClient } from '@/sanity/lib/client'
import {
  BLOG_POST_BY_SLUG_QUERY,
  BLOG_POSTS_ALL_QUERY,
  BLOG_POSTS_HOME_QUERY,
  BLOG_SLUGS_QUERY,
} from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import enMessages from '@/messages/en.json'
import nbMessages from '@/messages/nb.json'

export type BlogPostSummary = {
  slug: string
  publishedAt: string
  updatedAt: string
  readTimeMinutes: number
  coverImage: { src: string; alt: string }
  title: string
  excerpt: string
}

export type BlogPostDetail = BlogPostSummary & {
  metaDescription: string
  keywords: string[]
  bodyHtml: string
}

type LocalizedString = { en?: string | null; nb?: string | null } | null | undefined
type LocalizedKeywords = { en?: string[] | null; nb?: string[] | null } | null | undefined

type SanityBlogPostRow = {
  slug?: string | null
  publishedAt?: string | null
  updatedAt?: string | null
  readTimeMinutes?: number | null
  featured?: boolean | null
  title?: LocalizedString
  excerpt?: LocalizedString
  metaDescription?: LocalizedString
  keywords?: LocalizedKeywords
  coverAlt?: LocalizedString
  bodyHtml?: LocalizedString
  coverImage?: {
    alt?: LocalizedString
    asset?: { _id: string; url?: string }
  } | null
}

const messagesByLocale = {
  en: enMessages,
  nb: nbMessages,
} as const

function isSanityConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim())
}

function blogFetchOptions(slug?: string) {
  if (process.env.NODE_ENV === 'development') {
    return { cache: 'no-store' as const }
  }

  return {
    next: {
      revalidate: 60,
      tags: slug ? ['blogPost', `blogPost:${slug}`] : ['blogPost'],
    },
  }
}

function pickLocalized(value: LocalizedString, locale: AppLocale): string {
  if (!value) return ''
  return (locale === 'nb' ? value.nb : value.en) || value.en || value.nb || ''
}

function pickKeywords(value: LocalizedKeywords, locale: AppLocale): string[] {
  if (!value) return []
  const list = (locale === 'nb' ? value.nb : value.en) || value.en || value.nb
  return Array.isArray(list) ? list.filter(Boolean) : []
}

function toIsoDate(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback
  return value.slice(0, 10)
}

function coverSrcFromSanity(row: SanityBlogPostRow): string | null {
  if (row.coverImage?.asset?.url) {
    return urlFor(row.coverImage).width(1600).quality(85).url()
  }
  return null
}

function mapSanityRow(row: SanityBlogPostRow, locale: AppLocale): BlogPostSummary | null {
  const slug = row.slug?.trim()
  if (!slug) return null

  const coverSrc = coverSrcFromSanity(row)
  if (!coverSrc) return null

  const publishedAt = toIsoDate(row.publishedAt, new Date().toISOString().slice(0, 10))
  const updatedAt = toIsoDate(row.updatedAt, publishedAt)
  const coverAlt =
    pickLocalized(row.coverImage?.alt, locale) ||
    pickLocalized(row.coverAlt, locale) ||
    pickLocalized(row.title, locale)

  return {
    slug,
    publishedAt,
    updatedAt,
    readTimeMinutes: row.readTimeMinutes ?? 5,
    coverImage: { src: coverSrc, alt: coverAlt },
    title: pickLocalized(row.title, locale),
    excerpt: pickLocalized(row.excerpt, locale),
  }
}

function mapSanityDetail(row: SanityBlogPostRow, locale: AppLocale): BlogPostDetail | null {
  const summary = mapSanityRow(row, locale)
  if (!summary) return null

  return {
    ...summary,
    metaDescription: pickLocalized(row.metaDescription, locale) || summary.excerpt,
    keywords: pickKeywords(row.keywords, locale),
    bodyHtml: pickLocalized(row.bodyHtml, locale),
  }
}

function staticPostContent(slug: string, locale: AppLocale) {
  const posts = (messagesByLocale[locale].blog.posts as Record<string, {
    title: string
    metaDescription: string
    keywords: string
    coverAlt: string
    excerpt: string
    bodyHtml: string
  }>)[slug]

  if (posts) return posts

  const fallback = (messagesByLocale.en.blog.posts as Record<string, {
    title: string
    metaDescription: string
    keywords: string
    coverAlt: string
    excerpt: string
    bodyHtml: string
  }>)[slug]

  return fallback
}

function mapStaticSummary(slug: string, locale: AppLocale): BlogPostSummary | null {
  const meta = getStaticPostBySlug(slug)
  const content = staticPostContent(slug, locale)
  if (!meta || !content) return null

  return {
    slug: meta.slug,
    publishedAt: meta.publishedAt,
    updatedAt: meta.updatedAt,
    readTimeMinutes: meta.readTimeMinutes,
    coverImage: { src: meta.coverImage.src, alt: content.coverAlt },
    title: content.title,
    excerpt: content.excerpt,
  }
}

function mapStaticDetail(slug: string, locale: AppLocale): BlogPostDetail | null {
  const summary = mapStaticSummary(slug, locale)
  const content = staticPostContent(slug, locale)
  if (!summary || !content) return null

  return {
    ...summary,
    metaDescription: content.metaDescription,
    keywords: content.keywords.split('|').map((k) => k.trim()).filter(Boolean),
    bodyHtml: content.bodyHtml,
  }
}

function mapSanityRows(rows: SanityBlogPostRow[], locale: AppLocale): BlogPostSummary[] {
  return rows
    .map((row) => mapSanityRow(row, locale))
    .filter((row): row is BlogPostSummary => Boolean(row))
}

function staticSummaries(locale: AppLocale): BlogPostSummary[] {
  return staticPosts
    .map((post) => mapStaticSummary(post.slug, locale))
    .filter((post): post is BlogPostSummary => Boolean(post))
}

async function fetchSanityPostBySlug(slug: string): Promise<SanityBlogPostRow | null> {
  if (!isSanityConfigured()) return null

  try {
    return await liveClient.fetch<SanityBlogPostRow | null>(
      BLOG_POST_BY_SLUG_QUERY,
      { slug },
      blogFetchOptions(slug)
    )
  } catch {
    return null
  }
}

async function fetchSanitySlugs(): Promise<string[] | null> {
  if (!isSanityConfigured()) return null

  try {
    return await liveClient.fetch<string[]>(BLOG_SLUGS_QUERY, {}, blogFetchOptions())
  } catch {
    return null
  }
}

/** Homepage blog section — up to 3 featured/recent posts. */
export async function getBlogPosts(locale: AppLocale): Promise<BlogPostSummary[]> {
  if (!isSanityConfigured()) {
    return staticSummaries(locale)
  }

  try {
    const rows = await liveClient.fetch<SanityBlogPostRow[]>(
      BLOG_POSTS_HOME_QUERY,
      {},
      blogFetchOptions()
    )
    return mapSanityRows(rows ?? [], locale)
  } catch {
    return staticSummaries(locale)
  }
}

/** Full blog post for the detail page. */
export async function getBlogPostBySlug(
  slug: string,
  locale: AppLocale
): Promise<BlogPostDetail | null> {
  if (isSanityConfigured()) {
    const row = await fetchSanityPostBySlug(slug)
    if (row) {
      const mapped = mapSanityDetail(row, locale)
      if (mapped?.bodyHtml) return mapped
    }
  }

  return mapStaticDetail(slug, locale)
}

/** All slugs for static generation and sitemap. */
export async function getAllBlogSlugs(): Promise<string[]> {
  const fromSanity = await fetchSanitySlugs()
  if (fromSanity !== null) return fromSanity
  return getStaticSlugs()
}

/** Ordered list of all posts (for chapter numbers on detail pages). */
export async function getAllBlogPosts(locale: AppLocale): Promise<BlogPostSummary[]> {
  if (!isSanityConfigured()) {
    return staticSummaries(locale)
  }

  try {
    const rows = await liveClient.fetch<SanityBlogPostRow[]>(
      BLOG_POSTS_ALL_QUERY,
      {},
      blogFetchOptions()
    )
    return mapSanityRows(rows ?? [], locale)
  } catch {
    return staticSummaries(locale)
  }
}
