import { Link } from "react-router"
import { ArrowLeft, ExternalLink } from "lucide-react"
import type { Route } from "./+types/project-slug"

// Defines the structure of the frontmatter in your MDX files
interface Frontmatter {
  title: string
  description: string
  projectLink: string
  technologies: string[]
}

// Defines the structure of the module imported via glob
interface MDXModule {
  frontmatter: Frontmatter
  default: React.ComponentType
}

// Import MDX modules eagerly (build-time)
const modules = import.meta.glob<MDXModule>("./collection/*.mdx", {
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
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-primary-muted hover:text-primary-vivid font-mono mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>

        <article>
          <header className="mb-12 border-b border-primary-muted/20 pb-12">
            <div className="aspect-video w-full overflow-hidden mb-8 bg-app-muted/20 border border-primary-muted/20 rounded-none relative group">
              <div className="absolute inset-0 bg-primary-background/10 group-hover:bg-transparent transition-colors z-10" />
              <img
                src={`/projects-assets/${params.slug}.png`}
                alt={frontmatter.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />

              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary-vivid z-20" />
              <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary-vivid z-20" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary-vivid z-20" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary-vivid z-20" />
            </div>

            <h1 className="text-4xl md:text-5xl font-mono font-bold text-primary-vivid uppercase mb-6">
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
                  className="inline-flex items-center gap-2 px-6 py-2 bg-primary-vivid text-app-background font-mono font-bold hover:bg-primary-accent transition-colors"
                >
                  <span>View Project</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </header>

          <div
            className="prose prose-invert prose-mono max-w-none 
            prose-headings:text-primary-vivid prose-headings:font-normal prose-headings:uppercase
            prose-p:text-app-muted prose-p:leading-relaxed
            prose-a:text-primary-accent prose-a:no-underline hover:prose-a:underline
            prose-strong:text-primary-accent
            prose-code:text-primary-accent prose-code:bg-primary-muted/10 prose-code:px-1 prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-app-muted/10 prose-pre:border prose-pre:border-primary-muted/20
            prose-li:text-app-muted
            "
          >
            <Component />
          </div>
        </article>
      </div>
    </main>
  )
}
