/** Public project defaults so a Vercel build works before env vars are copied over. */
const DEFAULT_PROJECT_ID = 'hmwmjgro'
const DEFAULT_DATASET = 'production'

export const apiVersion = readEnv(process.env.NEXT_PUBLIC_SANITY_API_VERSION) || '2026-06-04'

export const dataset = readEnv(process.env.NEXT_PUBLIC_SANITY_DATASET) || DEFAULT_DATASET

export const projectId = readEnv(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) || DEFAULT_PROJECT_ID

function readEnv(value: string | undefined): string {
  return value?.trim().replace(/^['"]|['"]$/g, '') ?? ''
}
