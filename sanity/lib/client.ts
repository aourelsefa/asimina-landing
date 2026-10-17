import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

/** Fresh API reads for CMS content (no CDN cache). Use for blog and other editable content. */
export const liveClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})
