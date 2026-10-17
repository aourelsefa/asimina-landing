/**
 * Sanity Studio — server shell only (metadata + client Studio island).
 * Keep Studio in a client component so motion-dom is not pulled into SSR chunks.
 */
import Studio from './Studio'

export const dynamic = 'force-dynamic'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <Studio />
}
