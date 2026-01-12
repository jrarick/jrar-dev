import type { Route } from "./+types/index"
import { PageLayout, PageHeader } from "~/components/page-layout"
import { CyberCard } from "~/components/cyber-card"
import { Badge } from "~/components/badge"

const PROJECT_ORDER: Record<string, number> = {
  "setpoint-data-suite": 1,
  "longhorn-design-studio": 2,
  "shadcn-portable-text-editor": 3,
  "hydrogen-demo": 4,
  "support-docs-site": 5,
  "party-rental-ecommerce-template": 6,
}

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

// 1. Glob all MDX files from the collection directory eagerly
const modules = import.meta.glob<MDXModule>("./collection/*.mdx", {
  eager: true,
})

// 2. Map the modules to a usable data structure and sort by PROJECT_ORDER
const projects = Object.entries(modules)
  .map(([path, mod]) => {
    // Extract slug from path: "./collection/hydrogen-demo.mdx" -> "hydrogen-demo"
    const slug = path.replace("./collection/", "").replace(".mdx", "")
    return {
      slug,
      ...mod.frontmatter,
    }
  })
  .sort((a, b) => {
    const orderA = PROJECT_ORDER[a.slug] ?? Infinity
    const orderB = PROJECT_ORDER[b.slug] ?? Infinity
    return orderA - orderB
  })

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Projects" },
    {
      name: "description",
      content: "A collection of my work and experiments.",
    },
  ]
}

export default function Projects() {
  return (
    <PageLayout>
      <PageHeader title="Projects">
        <p className="font-mono text-app-vivid max-w-2xl">
          A collection of my work, experiments, and open source contributions.
        </p>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <CyberCard key={project.slug} to={`/projects/${project.slug}`}>
            <div className="aspect-video w-full overflow-hidden mb-6 bg-app-muted/20 border border-primary-muted/20">
              <img
                src={`/projects-assets/${project.slug}.png`}
                alt={project.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-mono font-bold text-primary-vivid group-hover:text-primary-accent truncate">
                {project.title}
              </h3>

              <p className="text-sm font-mono text-app-muted line-clamp-2 h-10 group-hover:text-primary-muted">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.technologies.slice(0, 3).map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
                {project.technologies.length > 3 && (
                  <Badge>+{project.technologies.length - 3}</Badge>
                )}
              </div>
            </div>
          </CyberCard>
        ))}
      </div>
    </PageLayout>
  )
}
