import { Link } from "~/components/link"
import { PageLayout, PageHeader } from "~/components/page-layout"
import { useBlogPosts } from "~/hooks/use-content"

export default function BlogIndex() {
  const posts = useBlogPosts()

  return (
    <PageLayout maxWidth="max-w-4xl" className="@2xl/main:p-8">
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
            <div className="flex-1 min-w-0 flex flex-col @2xl/main:flex-row @2xl/main:items-center justify-between gap-4">
              <span className="@2xl/main:truncate text-app-accent group-hover:text-primary-vivid">
                {post.title || post.slug}
              </span>
              <span className="shrink-0 tabular-nums text-xs text-app-muted group-hover:text-primary-muted">
                {post.date ? new Date(post.date).toISOString() : "UNKNOWN_DATE"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </PageLayout>
  )
}
