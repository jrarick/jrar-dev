export function loader() {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://jrar.dev/sitemap.xml

# Disallow API routes
Disallow: /api/
`

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
