import type { Route } from "./+types/home"
import { PageLayout } from "~/components/page-layout"
import { CyberCard } from "~/components/cyber-card"
import { Badge } from "~/components/badge"
import { Link } from "~/components/link"
import { useProjects, useBlogPosts } from "~/hooks/use-content"
import type { SVGProps } from "react"

const LinkedinLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} preserveAspectRatio="xMidYMid" viewBox="0 0 256 256">
    <path
      d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453"
      fill="currentColor"
    />
  </svg>
)

const GithubLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 1024 1024" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
      transform="scale(64)"
      fill="currentColor"
    />
  </svg>
)

const TwitterLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 1200 1227">
    <path
      fill="currentColor"
      d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"
    />
  </svg>
)

export function meta({}: Route.MetaArgs) {
  return [
    { title: "jrar.dev" },
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
      <section className="mb-20">
        <h1 className="text-4xl font-mono font-medium text-primary-vivid mb-4">
          My name is Josh Rarick
        </h1>
        <p className="text-lg/9 font-mono text-app-vivid mb-6 max-w-2xl">
          This is my website. I'm a product focused engineer, specializing in
          user interfaces and interaction. I am a TypeScript enjoyer and AI tool
          enthusiast.
        </p>
        <div className="flex gap-6">
          <a
            href="https://github.com/jrarick"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-primary-accent"
            aria-label="GitHub"
          >
            <GithubLogo className="w-5 h-5" />
          </a>
          <a
            href="https://x.com/josh_rarick"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-primary-accent"
            aria-label="Twitter"
          >
            <TwitterLogo className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/rarick-joshua/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-primary-accent"
            aria-label="LinkedIn"
          >
            <LinkedinLogo className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Projects Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-mono font-medium text-primary-vivid">
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
                <h3 className="text-xl font-mono font-medium text-primary-vivid group-hover:text-primary-accent truncate">
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
          <h2 className="text-xl font-mono font-medium text-primary-vivid">
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
