import { Link, useLoaderData } from "react-router"
import { PageLayout, PageHeader } from "~/components/page-layout"

// Define interface for frontmatter
interface Frontmatter {
  title: string
  date?: string
  description?: string
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
  const posts = Object.entries(modules).map(([filepath, module]) => {
    // Extract slug from filepath (e.g., "./posts/first-post.mdx" -> "first-post")
    const slug = filepath.replace(/^\.\/posts\/(.*)\.mdx$/, "$1")
    return {
      slug,
      frontmatter: module.frontmatter,
    }
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

      <ul className="flex flex-col gap-px bg-primary-background/20 border border-primary-background/20">
        {posts.map((post) => (
          <li
            key={post.slug}
            className="group relative bg-app-background hover:bg-primary-background/5 transition-colors"
          >
            <Link to={`/blog/${post.slug}`} className="block p-6">
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                <span className="text-xs text-app-muted shrink-0 w-32 font-bold opacity-60">
                  {post.frontmatter.date
                    ? new Date(post.frontmatter.date)
                        .toISOString()
                        .split("T")[0]
                    : "UNKNOWN_DATE"}
                </span>
                <div>
                  <h2 className="text-xl font-bold text-primary-muted group-hover:text-primary-vivid transition-colors mb-2">
                    {post.frontmatter.title || post.slug}
                  </h2>
                  {post.frontmatter.description && (
                    <p className="text-sm text-app-muted/80 max-w-2xl leading-relaxed">
                      {post.frontmatter.description}
                    </p>
                  )}
                </div>
              </div>
              {/* Hover indicator */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-vivid scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
            </Link>
          </li>
        ))}
      </ul>
    </PageLayout>
  )
}
