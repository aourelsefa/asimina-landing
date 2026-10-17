import { defineField, defineType } from 'sanity'
import { ThListIcon } from '@sanity/icons'
import { categoryIds, type CategoryId } from '../../data/categories'
import { portfolioImageMember } from './portfolioImage'

const categoryAlbumTitles: Record<CategoryId, string> = {
  wedding: 'Weddings',
  'couples-family': 'Couples & family',
  baptism: 'Baptism',
  'fashion-portraits': 'Fashion & portraits',
  events: 'Events',
  advertisment: 'Advertising',
}

const CATEGORY_ALBUM_ID_PREFIX = 'categoryAlbum-'

/** e.g. `categoryAlbum-wedding` → `wedding` */
export function categoryIdFromAlbumDocumentId(documentId: string): CategoryId | undefined {
  const base = documentId.replace(/^drafts\./, '')
  if (!base.startsWith(CATEGORY_ALBUM_ID_PREFIX)) return undefined
  const id = base.slice(CATEGORY_ALBUM_ID_PREFIX.length)
  return categoryIds.includes(id as CategoryId) ? (id as CategoryId) : undefined
}

export const categoryAlbum = defineType({
  name: 'categoryAlbum',
  title: 'Category album',
  type: 'document',
  icon: ThListIcon,
  fields: [
    defineField({
      name: 'categoryId',
      title: 'Service category',
      type: 'string',
      description:
        'Filled in automatically when you open an album from the left menu. If this appears empty, choose the matching category below once, then save.',
      hidden: ({ value }) => Boolean(value),
      readOnly: ({ value }) => Boolean(value),
      options: {
        list: categoryIds.map((id) => ({
          title: categoryAlbumTitles[id],
          value: id,
        })),
        layout: 'radio',
      },
      validation: (rule) =>
        rule.required().custom((value, context) => {
          if (value && categoryIds.includes(value as CategoryId)) return true
          const docId = context.document?._id?.replace(/^drafts\./, '') ?? ''
          const expected = categoryIdFromAlbumDocumentId(docId)
          if (expected) {
            return `Save the document (Ctrl+S / Cmd+S) so the category is applied, or pick “${categoryAlbumTitles[expected]}”.`
          }
          return 'Open this album from the sidebar under “Service category albums”.'
        }),
    }),
    defineField({
      name: 'images',
      title: 'Album images',
      description:
        'Photos on the service category page. Drag to reorder. Homepage service card covers are not managed here.',
      type: 'array',
      of: [portfolioImageMember],
      options: {
        layout: 'grid',
      },
    }),
  ],
  preview: {
    select: { categoryId: 'categoryId', imageCount: 'images' },
    prepare({ categoryId, imageCount }) {
      const id = categoryId as CategoryId | undefined
      const title = id ? categoryAlbumTitles[id] : 'Category album'
      const count = Array.isArray(imageCount) ? imageCount.length : 0
      return {
        title,
        subtitle: `${count} image${count === 1 ? '' : 's'}`,
      }
    },
  },
})

export { categoryAlbumTitles }
