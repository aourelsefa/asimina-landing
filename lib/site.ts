/** Production domain — override with NEXT_PUBLIC_SITE_URL in env (e.g. Vercel). */
export const defaultSiteUrl = 'https://asiminahabipi.com'

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '')
  }
  return defaultSiteUrl
}
