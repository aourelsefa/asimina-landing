'use client'

import ContactRingsLayout from '@/components/ContactRingsLayout'
import { useTranslations } from 'next-intl'

interface ContactProps {
  title?: string
  lead?: string
  email: string
  phone: string
  address: string
}

export default function Contact({ title, lead, email, phone, address }: ContactProps) {
  const t = useTranslations('contact')
  return (
    <ContactRingsLayout
      title={title ?? t('title')}
      lead={lead ?? t('lead')}
      email={email}
      phone={phone}
      address={address}
    />
  )
}
