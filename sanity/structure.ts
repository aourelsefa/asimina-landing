import type { StructureResolver } from 'sanity/structure'
import { DocumentTextIcon, ImagesIcon, ThListIcon } from '@sanity/icons'
import { categoryIds } from '../data/categories'
import { categoryAlbumTitles } from './schemaTypes/categoryAlbum'

const categoryDocumentId = (categoryId: string) => `categoryAlbum-${categoryId}`

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .menuItems([])
    .items([
      S.listItem()
        .title('Main gallery')
        .icon(ImagesIcon)
        .child(
          S.document()
            .schemaType('galleryAlbum')
            .documentId('galleryAlbum')
            .title('Main gallery')
        ),
      S.divider(),
      S.listItem()
        .title('Service category albums')
        .icon(ThListIcon)
        .child(
          S.list()
            .title('Service category albums')
            .menuItems([])
            .items(
              categoryIds.map((categoryId) =>
                S.listItem()
                  .title(categoryAlbumTitles[categoryId])
                  .icon(ThListIcon)
                  .child(
                    S.document()
                      .schemaType('categoryAlbum')
                      .documentId(categoryDocumentId(categoryId))
                      .title(categoryAlbumTitles[categoryId])
                  )
              )
            )
        ),
      S.divider(),
      S.listItem()
        .title('Blog posts')
        .icon(DocumentTextIcon)
        .child(
          S.documentTypeList('blogPost')
            .title('Blog posts')
            .filter('_type == "blogPost"')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
        ),
    ])
