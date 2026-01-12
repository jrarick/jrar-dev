import type { Route } from "./+types/index"
import { PageLayout, PageHeader } from "~/components/page-layout"
import { CyberCard } from "~/components/cyber-card"
import { Badge } from "~/components/badge"
import { useProjects } from "~/hooks/use-content"

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
  const projects = useProjects()

  return (
    <PageLayout>
      <PageHeader title="Projects">
        <p className="font-mono text-app-vivid max-w-2xl">
          my work, experiments, and open source contributions
        </p>
      </PageHeader>

      <div className="grid grid-cols-1 @3xl/main:grid-cols-2 @5xl/main:grid-cols-3 gap-6">
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
