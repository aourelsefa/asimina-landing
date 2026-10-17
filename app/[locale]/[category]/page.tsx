import { notFound } from 'next/navigation'
import { categories, type CategoryId } from '@/data/categories'
import { CategoryPageContent } from '@/components/CategoryPageContent'
import { getCategoryAlbumImages } from '@/lib/portfolioImages'

type CategoryPageProps = {
  params: Promise<{ locale: string; category: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params

  const category = categories.find((cat) => cat.slug === categorySlug)
  if (!category) {
    notFound()
  }

  const categoryIndex = categories.findIndex((c) => c.slug === category.slug)
  const categoryImages = await getCategoryAlbumImages(category.id as CategoryId)

  return (
    <CategoryPageContent
      category={category}
      categoryIndex={categoryIndex}
      categoryImages={categoryImages}
    />
  )
}
