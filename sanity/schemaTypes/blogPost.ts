import { defineField, defineType } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons'

const localizedString = (name: string, title: string, required = false) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({
        name: 'en',
        title: 'English',
        type: 'string',
        validation: required ? (rule) => rule.required() : undefined,
      }),
      defineField({
        name: 'nb',
        title: 'Norwegian',
        type: 'string',
      }),
    ],
  })

const localizedText = (name: string, title: string, rows = 4) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({
        name: 'en',
        title: 'English',
        type: 'text',
        rows,
      }),
      defineField({
        name: 'nb',
        title: 'Norwegian',
        type: 'text',
        rows,
      }),
    ],
  })

const localizedKeywords = () =>
  defineField({
    name: 'keywords',
    title: 'SEO keywords',
    type: 'object',
    fields: [
      defineField({
        name: 'en',
        title: 'English',
        type: 'array',
        of: [{ type: 'string' }],
        options: { layout: 'tags' },
      }),
      defineField({
        name: 'nb',
        title: 'Norwegian',
        type: 'array',
        of: [{ type: 'string' }],
        options: { layout: 'tags' },
      }),
    ],
  })

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'en',
          title: 'English',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'nb',
          title: 'Norwegian',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      description: 'Used in the web address, e.g. /blog/your-slug-here',
      options: {
        source: 'title.en',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last updated',
      type: 'datetime',
      description: 'Optional. Leave empty to use the published date.',
    }),
    defineField({
      name: 'readTimeMinutes',
      title: 'Read time (minutes)',
      type: 'number',
      initialValue: 5,
      validation: (rule) => rule.required().min(1).max(60),
    }),
    defineField({
      name: 'featured',
      title: 'Show on homepage',
      type: 'boolean',
      description: 'Featured posts appear in the blog section on the front page (up to 3).',
      initialValue: true,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'object',
          fields: [
            defineField({ name: 'en', title: 'English', type: 'string' }),
            defineField({ name: 'nb', title: 'Norwegian', type: 'string' }),
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    localizedText('excerpt', 'Excerpt', 3),
    localizedText('metaDescription', 'Meta description (SEO)', 3),
    localizedKeywords(),
    localizedString('coverAlt', 'Cover alt text (fallback if image alt is empty)'),
    defineField({
      name: 'bodyHtml',
      title: 'Article body (HTML)',
      type: 'object',
      description: 'Use headings (<h2>), paragraphs (<p>), and <strong> as in the existing articles.',
      fields: [
        defineField({
          name: 'en',
          title: 'English',
          type: 'text',
          rows: 16,
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'nb',
          title: 'Norwegian',
          type: 'text',
          rows: 16,
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Published date, newest',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'publishedAt',
      media: 'coverImage',
    },
    prepare({ title, subtitle, media }) {
      const date = subtitle
        ? new Date(subtitle).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'No date'
      return {
        title: title || 'Untitled post',
        subtitle: date,
        media,
      }
    },
  },
})
