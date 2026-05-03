import type { Metadata } from 'next'
import { headers } from 'next/headers'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // Locale-specific metadata is set in `app/[locale]/layout.tsx`.
  title: 'Asimina Habipi Photography',
  description:
    'Photography portfolio by Asimina Habipi - Based in Oslo, focusing on people, places, and atmosphere',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = headers().get('x-next-intl-locale') ?? 'en'

  return (
    <html lang={locale}>
      <body>
        {children}
      </body>
    </html>
  )
}

