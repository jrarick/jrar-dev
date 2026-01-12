import { Suspense, useMemo, lazy } from "react"
import { useLoaderData } from "react-router"
import type { Route } from "./+types/post"
import type { BlogFrontmatter, BlogMdxModule } from "~/lib/content-types"
import { Link } from "~/components/link"

export async function loader({ params }: Route.LoaderArgs) {
  const modules = import.meta.glob("./posts/*.mdx")
  const filepath = `./posts/${params.slug}.mdx`

  if (!modules[filepath]) {
    throw new Response("Not Found", { status: 404 })
  }

  const module = (await modules[filepath]()) as BlogMdxModule

  return {
    slug: params.slug,
    frontmatter: module.frontmatter,
  }
}

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const { slug, frontmatter } = loaderData

  const modules = import.meta.glob("./posts/*.mdx")
  const filepath = `./posts/${slug}.mdx`

  const Component = useMemo(() => {
    const importFn = modules[filepath] as () => Promise<BlogMdxModule>
    return lazy(importFn)
  }, [filepath])

  return (
    <div className="min-h-screen bg-app-background text-app-accent font-mono p-8">
      <div className="mx-auto">
        <nav className="mb-12">
          <Link href="/blog" className="decoration-transparent">
            {"< cd .."}
          </Link>
        </nav>

        <article
          className="
          prose prose-sm prose-invert
          prose-headings:text-primary-vivid prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-wide
          prose-h1:text-4xl prose-h1:border-b prose-h1:border-primary-background prose-h1:pb-4
          prose-p:text-app-accent/90 prose-p:leading-relaxed
          prose-a:text-primary-muted prose-a:no-underline hover:prose-a:text-primary-vivid hover:prose-a:underline
          prose-strong:text-primary-vivid
          prose-code:text-magenta prose-code:bg-app-muted/10 prose-code:px-1 prose-code:rounded-none prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-app-muted/20 prose-pre:rounded-none
          prose-blockquote:border-l-2 prose-blockquote:border-primary-muted prose-blockquote:text-app-muted  
        "
        >
          <div className="mb-8 border-b border-primary-background pb-8">
            <h1 className="text-4xl font-bold uppercase tracking-wide text-primary-vivid mb-2 border-0! pb-0!">
              {frontmatter.title}
            </h1>
            {frontmatter.date && (
              <div className="text-app-muted text-sm font-mono">
                <span className="tabular-nums">
                  {new Date(frontmatter.date).toISOString()}
                </span>
              </div>
            )}
          </div>

          <Suspense
            key={slug}
            fallback={
              <div className="flex items-center gap-2 text-primary-muted animate-pulse">
                <span className="w-2 h-4 bg-primary-muted" />
                LOADING_DATA...
              </div>
            }
          >
            <Component />
          </Suspense>
        </article>
      </div>
    </div>
  )
}
