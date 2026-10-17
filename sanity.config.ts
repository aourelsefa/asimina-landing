'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\app\studio\[[...tool]]\page.tsx` route
 */

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {categoryIds} from './data/categories'
import {dataset, projectId} from './sanity/env'
import {schema} from './sanity/schemaTypes'
import {categoryAlbumTitles} from './sanity/schemaTypes/categoryAlbum'
import {structure} from './sanity/structure'
import {simpleStudio} from './sanity/plugins/simpleStudio'
import './sanity/studio/simple-studio.css'

export default defineConfig({
  name: 'asimina-photos',
  title: 'Asimina — Site manager',
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema: {
    types: schema.types,
    templates: (prev) => [
      ...prev,
      ...categoryIds.map((categoryId) => ({
        id: `categoryAlbum-${categoryId}`,
        title: categoryAlbumTitles[categoryId],
        schemaType: 'categoryAlbum',
        value: {categoryId},
      })),
    ],
  },
  plugins: [
    structureTool({
      name: 'photos',
      title: 'Photos',
      structure,
    }),
    simpleStudio(),
  ],
})
