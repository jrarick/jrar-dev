import type { Route } from "./+types/home"
import { PageLayout } from "~/components/page-layout"
import { CyberCard } from "~/components/cyber-card"
import { Badge } from "~/components/badge"
import { Link } from "~/components/link"
import { useProjects, useBlogPosts } from "~/hooks/use-content"
import { Github, Twitter, Linkedin } from "lucide-react"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Josh Rarick" },
    {
      name: "description",
      content: "Developer portfolio and blog",
    },
  ]
}

export default function Home() {
  const projects = useProjects().slice(0, 3)
  const posts = useBlogPosts().slice(0, 3)

  return (
    <PageLayout>
      {/* Intro Section */}
      <section className="mb-16">
        <h1 className="text-4xl font-mono font-bold text-primary-vivid mb-4">
          Josh Rarick
        </h1>
        <p className="text-lg font-mono text-app-vivid mb-6 max-w-2xl">
          full-stack developer building for the web
        </p>
        <div className="flex gap-4">
          <a
            href="https://github.com/jrarick"
            target="_blank"
            rel="noopener noreferrer"
            className="text-app-muted hover:text-primary-vivid transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://x.com/josh_rarick"
            target="_blank"
            rel="noopener noreferrer"
            className="text-app-muted hover:text-primary-vivid transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/rarick-joshua/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-app-muted hover:text-primary-vivid transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Projects Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-mono font-bold text-primary-vivid">
            Projects
          </h2>
          <Link href="/projects" className="text-sm">
            View all →
          </Link>
        </div>

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
      </section>

      {/* Blog Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-mono font-bold text-primary-vivid">
            Blog
          </h2>
          <Link href="/blog" className="text-sm">
            View all →
          </Link>
        </div>

        <div className="font-mono bg-app-background border border-primary-background">
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
                  {post.date
                    ? new Date(post.date).toISOString().split("T")[0]
                    : "UNKNOWN_DATE"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageLayout>
  )
}
