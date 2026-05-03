import type { Metadata } from 'next'
import Script from 'next/script'
import { headers } from 'next/headers'
import './globals.css'

const GA_MEASUREMENT_ID = 'G-9GP0STRTEN'

import { defaultSiteUrl } from '@/lib/site'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : defaultSiteUrl)

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // Locale-specific metadata is set in `app/[locale]/layout.tsx`.
  title: 'Asimina Habipi Photography',
  description:
    'Photography portfolio by Asimina Habipi - Based in Oslo, focusing on people, places, and atmosphere',
  icons: {
    icon: [{ url: '/asimina-habipi-logo.png', type: 'image/png' }],
    apple: '/asimina-habipi-logo.png',
    shortcut: '/asimina-habipi-logo.png',
  },
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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        {children}
      </body>
    </html>
  )
}

