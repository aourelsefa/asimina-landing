export const GALLERY_ALBUM_QUERY = `*[_type == "galleryAlbum" && _id == "galleryAlbum"][0]{
  images[]{
    _key,
    alt,
    image{
      asset->{
        _id,
        url,
        originalFilename,
        metadata { dimensions { width, height } }
      }
    }
  }
}.images`

export const CATEGORY_ALBUM_QUERY = `*[_type == "categoryAlbum" && categoryId == $categoryId][0]{
  images[]{
    _key,
    alt,
    image{
      asset->{
        _id,
        url,
        originalFilename,
        metadata { dimensions { width, height } }
      }
    }
  }
}.images`

const blogPostFields = `{
  "slug": slug.current,
  publishedAt,
  updatedAt,
  readTimeMinutes,
  featured,
  title,
  excerpt,
  metaDescription,
  keywords,
  coverAlt,
  bodyHtml,
  coverImage {
    alt,
    asset->{ _id, url }
  }
}`

export const BLOG_POSTS_HOME_QUERY = `*[_type == "blogPost" && defined(slug.current)] | order(featured desc, publishedAt desc)[0...3] ${blogPostFields}`

export const BLOG_POSTS_ALL_QUERY = `*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) ${blogPostFields}`

export const BLOG_POST_BY_SLUG_QUERY = `*[_type == "blogPost" && slug.current == $slug][0] ${blogPostFields}`

export const BLOG_SLUGS_QUERY = `*[_type == "blogPost" && defined(slug.current)].slug.current`
