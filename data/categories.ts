export const categoryIds = [
  'wedding',
  'couples-family',
  'baptism',
  'fashion-portraits',
  'events',
  'advertisment',
] as const

export type CategoryId = (typeof categoryIds)[number]

export type Category = {
  id: CategoryId
  slug: CategoryId
}

export const categories: Category[] = categoryIds.map((id) => ({ id, slug: id }))
