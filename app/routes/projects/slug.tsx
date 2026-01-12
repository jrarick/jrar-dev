import { ExternalLink } from "lucide-react"
import { Link } from "~/components/link"
import type { ProjectMdxModule } from "~/lib/content-types"
import type { Route } from "./+types/slug"

// Import MDX modules eagerly (build-time)
const modules = import.meta.glob<ProjectMdxModule>("./collection/*.mdx", {
  eager: true,
})

export async function loader({ params }: Route.LoaderArgs) {
  const slug = params.slug
  const path = `./collection/${slug}.mdx`
  const mod = modules[path]

  if (!mod) {
    throw new Response("Project Not Found", { status: 404 })
  }

  return {
    slug,
    frontmatter: mod.frontmatter,
  }
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData) return [{ title: "Project Not Found" }]
  return [
    { title: loaderData.frontmatter.title },
    { name: "description", content: loaderData.frontmatter.description },
  ]
}

export default function ProjectPost({
  loaderData,
  params,
}: Route.ComponentProps) {
  // We need to access the component from the module map again because
  // components cannot be serialized from the loader.
  const path = `./collection/${params.slug}.mdx`
  const Component = modules[path]?.default

  if (!Component) {
    return <div>Project not found</div>
  }

  const { frontmatter } = loaderData

  return (
    <main className="min-h-screen bg-app-background py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/projects" className="decoration-transparent">
          {"< cd .."}
        </Link>

        <article className="pt-12">
          <header className="mb-12 border-b border-primary-muted/20 pb-12">
            <div className="aspect-video w-full overflow-hidden mb-8 bg-app-muted/20 border border-primary-muted/20 rounded-none relative group">
              <div className="absolute inset-0 bg-primary-background/10 group-hover:bg-transparent z-10" />
              <img
                src={`/projects-assets/${params.slug}.png`}
                alt={frontmatter.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0"
              />

              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary-vivid z-20" />
              <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary-vivid z-20" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary-vivid z-20" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary-vivid z-20" />
            </div>

            <h1 className="text-4xl @3xl/main:text-5xl font-mono font-bold text-primary-vivid uppercase mb-6">
              {frontmatter.title}
            </h1>

            <p className="text-xl font-mono text-app-vivid mb-8 leading-relaxed">
              {frontmatter.description}
            </p>

            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {frontmatter.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-sm font-mono text-primary-muted border border-primary-muted/40 px-3 py-1 bg-primary-background/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {frontmatter.projectLink && (
                <a
                  href={frontmatter.projectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2 bg-primary-vivid text-app-background font-mono font-bold hover:bg-primary-accent"
                >
                  <span>View Project</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </header>

          <div
            className="
          prose prose-invert max-w-none
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
            <Component />
          </div>
        </article>
      </div>
    </main>
  )
}
