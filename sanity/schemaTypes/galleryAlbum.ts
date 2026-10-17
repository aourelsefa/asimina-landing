import { defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons'
import { portfolioImageMember } from './portfolioImage'

export const galleryAlbum = defineType({
  name: 'galleryAlbum',
  title: 'Main gallery',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Main gallery',
      readOnly: true,
    }),
    defineField({
      name: 'images',
      title: 'Gallery images',
      description:
        'Photos shown on the Gallery page and the scrolling strip on the home page. Drag to reorder.',
      type: 'array',
      of: [portfolioImageMember],
      options: {
        layout: 'grid',
      },
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Main gallery' }
    },
  },
})
