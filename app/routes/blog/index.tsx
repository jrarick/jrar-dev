import { useLoaderData } from "react-router"
import { Link } from "~/components/link"
import { PageLayout, PageHeader } from "~/components/page-layout"

// Define interface for frontmatter
interface Frontmatter {
  title: string
  date?: string
  [key: string]: any
}

// Define interface for MDX module
interface MdxModule {
  frontmatter: Frontmatter
  default: React.ComponentType
}

export async function loader() {
  // Use import.meta.glob to load all MDX files in the posts directory
  const modules = import.meta.glob<MdxModule>("./posts/*.mdx", { eager: true })

  // Map over the modules to extract slug and frontmatter
  const posts = Object.entries(modules)
    .map(([filepath, module]) => {
      // Extract slug from filepath (e.g., "./posts/first-post.mdx" -> "first-post")
      const slug = filepath.replace(/^\.\/posts\/(.*)\.mdx$/, "$1")
      return {
        slug,
        frontmatter: module.frontmatter,
      }
    })
    .sort((a, b) => {
      // Sort posts by date descending
      const dateA = new Date(a.frontmatter.date || 0).getTime()
      const dateB = new Date(b.frontmatter.date || 0).getTime()
      return dateB - dateA
    })

  return { posts }
}

export default function BlogIndex() {
  const { posts } = useLoaderData<typeof loader>()

  return (
    <PageLayout maxWidth="max-w-4xl" className="p-8">
      <PageHeader
        title="~/blog // INDEX"
        className="border-b border-primary-background pb-4"
      >
        <p className="text-app-muted mt-2 text-sm">
          {posts.length} entries found...
        </p>
      </PageHeader>

      <div className="font-mono bg-app-background border border-primary-background mt-8">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex items-center gap-3 py-2.5 px-4 text-sm hover:bg-primary-background/50 hover:text-primary-vivid border-b border-primary-background/50 last:border-b-0 no-underline hover:decoration-0 text-app-accent"
          >
            <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
              <span className="truncate text-app-accent group-hover:text-primary-vivid">
                {post.frontmatter.title || post.slug}
              </span>
              <span className="shrink-0 tabular-nums text-xs text-app-muted group-hover:text-primary-muted">
                {post.frontmatter.date
                  ? new Date(post.frontmatter.date).toISOString()
                  : "UNKNOWN_DATE"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </PageLayout>
  )
}
