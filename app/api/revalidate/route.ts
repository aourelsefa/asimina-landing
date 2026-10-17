import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

type SanityWebhookBody = {
  _type?: string
  slug?: { current?: string }
  ids?: { created?: string[]; updated?: string[]; deleted?: string[] }
}

function revalidateBlog(slug?: string) {
  revalidateTag('blogPost')
  if (slug) {
    revalidateTag(`blogPost:${slug}`)
  }

  revalidatePath('/', 'layout')
}

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  if (!secret || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  let body: SanityWebhookBody = {}
  try {
    body = (await request.json()) as SanityWebhookBody
  } catch {
    revalidateBlog()
    return NextResponse.json({ revalidated: true, scope: 'blog' })
  }

  if (body._type === 'blogPost') {
    revalidateBlog(body.slug?.current)
    return NextResponse.json({ revalidated: true, scope: 'blogPost' })
  }

  const deletedIds = body.ids?.deleted ?? []
  const deletedBlogIds = deletedIds.filter((id) => id.startsWith('blogPost') || id.includes('blogPost'))
  if (deletedBlogIds.length > 0) {
    revalidateBlog()
    return NextResponse.json({ revalidated: true, scope: 'blogPost-delete' })
  }

  revalidateBlog()
  return NextResponse.json({ revalidated: true, scope: 'all-blog' })
}
