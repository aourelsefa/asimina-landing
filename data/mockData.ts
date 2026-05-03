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

/** Used in auto-generated `alt` for portfolio files under `public/`. */
export const PHOTOGRAPHER_IMAGE_ALT_BRAND = 'Asimina Habipi Photography'

/** Short topic segment per service (English; screen readers + SEO). */
const serviceImageAltTopic: Record<CategoryId, string> = {
  wedding: 'Wedding',
  'couples-family': 'Couples and family',
  baptism: 'Baptism',
  'fashion-portraits': 'Fashion and portraits',
  events: 'Events',
  advertisment: 'Advertising',
}

const GALLERY_FOLDER_ALT_TOPIC = 'Gallery'

function humanizeFilenameStem(filename: string): string {
  let stem = filename.replace(/\.[^.]+$/i, '')
  stem = stem.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()
  if (stem.length > 72) {
    stem = `${stem.slice(0, 69)}…`
  }
  return stem || 'Photo'
}

/** SEO- and accessibility-friendly alt for synced folder images (unique per file). */
export function buildFolderImageAlt(topic: string, filename: string): string {
  return `${PHOTOGRAPHER_IMAGE_ALT_BRAND} — ${topic}: ${humanizeFilenameStem(filename)}`
}

/** Alt for homepage service card cover images (single hero shot per category). */
export function categoryServiceCardAlt(categoryId: CategoryId): string {
  return `${PHOTOGRAPHER_IMAGE_ALT_BRAND} — ${serviceImageAltTopic[categoryId]}, Oslo`
}

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
  idStart: number,
  altTopic: string
): WordPressImage[] {
  return filenames.map((filename, index) => ({
    id: idStart + index,
    source_url: `/${publicFolder}/${filename}`,
    alt_text: buildFolderImageAlt(altTopic, filename),
    media_details: {
      width: 1600,
      height: 1200,
    },
  }))
}

/** Main gallery page + home scrolling strip — from `public/gallery` (excludes about-me.JPG, used in About). */
export const mockGallery = mockImagesFromFolder(
  'gallery',
  galleryImageFilenames,
  3,
  GALLERY_FOLDER_ALT_TOPIC
)

const fashionPortraitGallery = (() => {
  const topic = serviceImageAltTopic['fashion-portraits']
  const fromFashion = mockImagesFromFolder('fashion', fashion_files, 30_000, topic)
  const fromPortraits = mockImagesFromFolder(
    'portraits',
    portraits_files,
    30_000 + fashion_files.length,
    topic
  )
  return [...fromFashion, ...fromPortraits]
})()

/** Service category detail pages — each folder under `public/` (`baptism` uses folder `vaptism` on disk). */
export const mockGalleryByCategory: Record<CategoryId, WordPressImage[]> = {
  wedding: mockImagesFromFolder('wedding', wedding_files, 10_000, serviceImageAltTopic.wedding),
  'couples-family': mockImagesFromFolder(
    'Couples',
    couples_family_files,
    20_000,
    serviceImageAltTopic['couples-family']
  ),
  baptism: mockImagesFromFolder('vaptism', baptism_files, 25_000, serviceImageAltTopic.baptism),
  'fashion-portraits': fashionPortraitGallery,
  events: mockImagesFromFolder('events', events_files, 50_000, serviceImageAltTopic.events),
  advertisment: mockImagesFromFolder(
    'advertisment',
    advertisment_files,
    60_000,
    serviceImageAltTopic.advertisment
  ),
}

export const mockContact = {
  email: 'asiminahabipi@gmail.com',
  phone: '+47 925 25 988',
  address: 'Oslo',
}

/** Digits only, for `wa.me` / Viber deep links — matches `mockContact.phone`. */
export const contactPhoneE164Digits = mockContact.phone.replace(/\D/g, '')

export const socialInstagramUrl = 'https://www.instagram.com/asimina_habipi/?hl=en'
