export const blogSlugs = [
  'natural-light-wedding-photography-oslo',
  'baptism-family-photographer-norway',
  'authentic-portrait-photography-oslo',
] as const

export type BlogSlug = (typeof blogSlugs)[number]

export type BlogPostMeta = {
  slug: BlogSlug
  publishedAt: string
  updatedAt: string
  readTimeMinutes: number
  coverImage: { src: string }
}

export const blogPosts: BlogPostMeta[] = [
  {
    slug: 'natural-light-wedding-photography-oslo',
    publishedAt: '2025-10-12',
    updatedAt: '2025-10-12',
    readTimeMinutes: 6,
    coverImage: { src: '/services/wedding-in-islo.jpg' },
  },
  {
    slug: 'baptism-family-photographer-norway',
    publishedAt: '2025-11-03',
    updatedAt: '2025-11-03',
    readTimeMinutes: 5,
    coverImage: { src: '/Couples/DSC_0016.jpg' },
  },
  {
    slug: 'authentic-portrait-photography-oslo',
    publishedAt: '2025-12-01',
    updatedAt: '2025-12-18',
    readTimeMinutes: 7,
    coverImage: { src: '/services/portrait-in-oslo.jpg' },
  },
]

export function getPostBySlug(slug: string): BlogPostMeta | undefined {
  return blogPosts.find((p) => p.slug === (slug as BlogSlug))
}

export function getAllSlugs(): string[] {
  return blogPosts.map((p) => p.slug)
}
