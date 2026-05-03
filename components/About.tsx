'use client'

import AboutPolaroidLayout from '@/components/AboutPolaroidLayout'
import { useTranslations } from 'next-intl'
import { WordPressImage } from '@/types/wordpress'

interface AboutProps {
  title: string
  description: string
  profileImage: WordPressImage | null
}

export default function About({ title, description, profileImage }: AboutProps) {
  const t = useTranslations('about')
  return (
    <AboutPolaroidLayout
      sectionId="about"
      title={title}
      description={description}
      imageSrc={profileImage?.source_url ?? null}
      imageAlt={profileImage?.alt_text || t('profileAltFallback')}
    />
  )
}
