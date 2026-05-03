import type { WordPressImage } from '@/types/wordpress'
import type { CategoryId } from './categories'
import {
  advertisment_files,
  baptism_files,
  couples_family_files,
  events_files,
  fashion_files,
  galleryImageFilenames,
  portraits_files,
  wedding_files,
} from './generatedImageLists'

export const mockHero = {
  backgroundImage: {
    id: 1,
    source_url: '/asimina-habipi-photographer-in-oslo.jpg',
    alt_text: '',
    media_details: {
      width: 1920,
      height: 1080,
    },
  },
}

export const mockAbout = {
  profileImage: {
    id: 2,
    source_url: '/gallery/about-me.JPG',
    alt_text: '',
    media_details: {
      width: 800,
      height: 800,
    },
  },
}

function mockImagesFromFolder(
  publicFolder: string,
  filenames: readonly string[],
  idStart: number
): WordPressImage[] {
  return filenames.map((filename, index) => ({
    id: idStart + index,
    source_url: `/${publicFolder}/${filename}`,
    alt_text: '',
    media_details: {
      width: 1600,
      height: 1200,
    },
  }))
}

/** Main gallery page + home scrolling strip — from `public/gallery` (excludes about-me.JPG, used in About). */
export const mockGallery = mockImagesFromFolder('gallery', galleryImageFilenames, 3)

const fashionPortraitGallery = (() => {
  const fromFashion = mockImagesFromFolder('fashion', fashion_files, 30_000)
  const fromPortraits = mockImagesFromFolder(
    'portraits',
    portraits_files,
    30_000 + fashion_files.length
  )
  return [...fromFashion, ...fromPortraits]
})()

/** Service category detail pages — each folder under `public/` (`baptism` uses folder `vaptism` on disk). */
export const mockGalleryByCategory: Record<CategoryId, WordPressImage[]> = {
  wedding: mockImagesFromFolder('wedding', wedding_files, 10_000),
  'couples-family': mockImagesFromFolder('Couples', couples_family_files, 20_000),
  baptism: mockImagesFromFolder('vaptism', baptism_files, 25_000),
  'fashion-portraits': fashionPortraitGallery,
  events: mockImagesFromFolder('events', events_files, 50_000),
  advertisment: mockImagesFromFolder('advertisment', advertisment_files, 60_000),
}

export const mockContact = {
  email: 'asiminahabipi@gmail.com',
  phone: '+47 925 25 988',
  address: 'Oslo',
}

/** Digits only, for `wa.me` / Viber deep links — matches `mockContact.phone`. */
export const contactPhoneE164Digits = mockContact.phone.replace(/\D/g, '')

export const socialInstagramUrl = 'https://www.instagram.com/asimina_habipi/?hl=en'
