import { defineArrayMember, defineField, defineType } from 'sanity'
import { ImageIcon } from '@sanity/icons'

export const portfolioImage = defineType({
  name: 'portfolioImage',
  title: 'Portfolio image',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt text (optional)',
      type: 'string',
      description:
        'Describe the photo for accessibility and SEO. Leave empty to auto-generate from the file name.',
    }),
  ],
  preview: {
    select: {
      title: 'alt',
      media: 'image',
      filename: 'image.asset.originalFilename',
    },
    prepare({ title, media, filename }) {
      return {
        title: title || filename || 'Portfolio image',
        media,
      }
    },
  },
})

export const portfolioImageMember = defineArrayMember({
  type: 'portfolioImage',
})
