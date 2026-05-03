'use client'

import { NextIntlClientProvider } from 'next-intl'
import type { AbstractIntlMessages } from 'next-intl'

type Props = {
  locale: string
  messages: AbstractIntlMessages
  children: React.ReactNode
}

export default function IntlProvider({ locale, messages, children }: Props) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      onError={() => {
        // Avoid crashing the page on missing translation keys.
      }}
      getMessageFallback={({ namespace, key }) => (namespace ? `${namespace}.${key}` : key)}
    >
      {children}
    </NextIntlClientProvider>
  )
}

