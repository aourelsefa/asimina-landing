import { type SchemaTypeDefinition } from 'sanity'
import { portfolioImage } from './portfolioImage'
import { galleryAlbum } from './galleryAlbum'
import { categoryAlbum } from './categoryAlbum'
import { blogPost } from './blogPost'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [portfolioImage, galleryAlbum, categoryAlbum, blogPost],
}
