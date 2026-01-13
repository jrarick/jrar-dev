import { registry } from "~/registry"
import { loadBlogPosts, loadProjects } from "~/lib/content.server"
import { BASE_URL } from "~/lib/meta-helpers"

interface SitemapEntry {
  loc: string
  lastmod?: string
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never"
  priority?: number
}

function buildSitemapXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${entry.loc}</loc>${
      entry.lastmod
        ? `
    <lastmod>${entry.lastmod}</lastmod>`
        : ""
    }${
      entry.changefreq
        ? `
    <changefreq>${entry.changefreq}</changefreq>`
        : ""
    }${
      entry.priority !== undefined
        ? `
    <priority>${entry.priority}</priority>`
        : ""
    }
  </url>`
    )
    .join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}

export function loader() {
  const staticRoutes: SitemapEntry[] = [
    { loc: `${BASE_URL}/`, priority: 1.0, changefreq: "weekly" },
    { loc: `${BASE_URL}/blog`, priority: 0.8, changefreq: "weekly" },
    { loc: `${BASE_URL}/projects`, priority: 0.8, changefreq: "monthly" },
    { loc: `${BASE_URL}/components`, priority: 0.6, changefreq: "monthly" },
    { loc: `${BASE_URL}/bookmarks`, priority: 0.6, changefreq: "weekly" },
    { loc: `${BASE_URL}/tools`, priority: 0.5, changefreq: "monthly" },
  ]

  const blogPosts = loadBlogPosts()
  const blogRoutes: SitemapEntry[] = blogPosts.map((post) => ({
    loc: `${BASE_URL}/blog/${post.slug}`,
    lastmod: post.date
      ? new Date(post.date).toISOString().split("T")[0]
      : undefined,
    changefreq: "yearly" as const,
    priority: 0.7,
  }))

  const projects = loadProjects()
  const projectRoutes: SitemapEntry[] = projects.map((project) => ({
    loc: `${BASE_URL}/projects/${project.slug}`,
    changefreq: "yearly" as const,
    priority: 0.7,
  }))

  const componentRoutes: SitemapEntry[] = Object.keys(registry).map((slug) => ({
    loc: `${BASE_URL}/components/${slug}`,
    changefreq: "monthly" as const,
    priority: 0.5,
  }))

  const allEntries = [
    ...staticRoutes,
    ...blogRoutes,
    ...projectRoutes,
    ...componentRoutes,
  ]

  const sitemap = buildSitemapXml(allEntries)

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
