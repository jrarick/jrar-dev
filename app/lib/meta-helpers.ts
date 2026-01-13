export const BASE_URL = "https://jrar.dev"

/**
 * Options for generating Open Graph image meta tags
 */
export interface OGImageMetaOptions {
  title: string
  description: string
  url: string
  ogImagePath: string
  type?: "website" | "article"
  publishedTime?: string
}

/**
 * Generate Open Graph and Twitter Card meta tags
 *
 * Generates standard meta tags for:
 * - Open Graph (og:*)
 * - Twitter Card (twitter:*)
 *
 * @param options - Meta tag options
 * @returns Array of meta tag objects compatible with React Router meta function
 */
export function generateOGImageMeta(options: OGImageMetaOptions) {
  const {
    title,
    description,
    url,
    ogImagePath,
    type = "website",
    publishedTime,
  } = options

  const absoluteUrl = `${BASE_URL}${url}`
  const absoluteImageUrl = `${BASE_URL}${ogImagePath}`

  const meta = [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: absoluteUrl },
    { property: "og:url", content: absoluteUrl },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: absoluteImageUrl },
    { property: "og:type", content: type },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: absoluteImageUrl },
  ]

  if (type === "article" && publishedTime) {
    meta.push({ property: "article:published_time", content: publishedTime })
  }

  return meta
}
